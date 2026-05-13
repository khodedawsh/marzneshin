import asyncio
import atexit
import logging
import ssl
import tempfile

from grpclib import GRPCError
from grpclib.client import Channel
from grpclib.exceptions import StreamTerminatedError

from .base import MarzNodeBase
from .database import MarzNodeDB
from .marznode_grpc import MarzServiceStub
from .marznode_pb2 import (
    UserData,
    UsersData,
    Empty,
    User,
    Inbound,
    BackendConfig,
    BackendLogsRequest,
    Backend,
    RestartBackendRequest,
    BackendStats,
)
from ..models.node import NodeStatus

logger = logging.getLogger(__name__)


def string_to_temp_file(content: str):
    file = tempfile.NamedTemporaryFile(mode="w+t")
    file.write(content)
    file.flush()
    return file


def _root_cause(exc: BaseException) -> BaseException:
    """Walk ``__context__`` / ``__cause__`` to find the most informative
    underlying exception.

    grpclib has a known cosmetic bug: when the remote side abruptly tears
    down the H2 stream (``StreamTerminatedError: Connection lost``), the
    ``async with stream`` ``__aexit__`` calls ``Stream.reset_nowait()``,
    which in turn does ``self._transport.write(...)`` on an already
    half-closed SSL transport. asyncio's ``_SSLProtocolTransport.write``
    then dereferences ``self._ssl_protocol`` (already nulled by a prior
    ``close()``) and raises::

        AttributeError: 'NoneType' object has no attribute '_write_appdata'

    That AttributeError gets re-raised on top of the *real* cause, which
    Python preserves in ``__context__`` / ``__cause__``. This helper
    digs that real cause out so we can log
    ``StreamTerminatedError: Connection lost`` (= node killed the stream)
    instead of the misleading ``_write_appdata`` noise.
    """
    seen: set[int] = set()
    cur: BaseException | None = exc
    best: BaseException = exc
    while cur is not None and id(cur) not in seen:
        seen.add(id(cur))
        if not isinstance(cur, (AttributeError, asyncio.CancelledError)):
            best = cur
        cur = cur.__cause__ or cur.__context__
    return best


def _is_spurious_appdata_error(exc: BaseException) -> bool:
    """True iff ``exc`` is the cosmetic ``_write_appdata`` AttributeError
    raised by grpclib/asyncio on a torn-down SSL transport."""
    return (
        isinstance(exc, AttributeError)
        and "_write_appdata" in str(exc)
    )


class MarzNodeGRPCLIB(MarzNodeBase, MarzNodeDB):
    def __init__(
        self,
        node_id: int,
        address: str,
        port: int,
        ssl_key: str,
        ssl_cert: str,
        usage_coefficient: int = 1,
    ):
        self.id = node_id
        self._address = address
        self._port = port

        self._key_file = string_to_temp_file(ssl_key)
        self._cert_file = string_to_temp_file(ssl_cert)

        ctx = ssl.create_default_context()
        ctx.load_cert_chain(self._cert_file.name, self._key_file.name)
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        self._channel = Channel(self._address, self._port, ssl=ctx)
        self._stub = MarzServiceStub(self._channel)
        self._monitor_task = asyncio.create_task(self._monitor_channel())
        self._streaming_task = None

        self._updates_queue = asyncio.Queue(1)
        self.synced = False
        self.usage_coefficient = usage_coefficient
        atexit.register(self._channel.close)

    async def stop(self):
        self._channel.close()
        self._monitor_task.cancel()

    def _force_close_channel(self) -> None:
        """Drop the underlying H2 protocol/SSL transport so the next
        ``__connect__`` call creates a fresh connection.

        When the SSL transport gets torn down by asyncio (node restart,
        abrupt TCP RST, timeout), ``_SSLProtocolTransport._ssl_protocol``
        may be nulled while ``H2Protocol.connection_lost`` is never
        fired. ``Channel._connected`` then keeps returning ``True`` and
        every subsequent RPC tries to write through the dead transport,
        producing ``AttributeError: 'NoneType' object has no attribute
        '_write_appdata'``. Calling ``Channel.close()`` clears
        ``_protocol`` so the monitor loop reconnects cleanly on the next
        iteration.
        """
        try:
            self._channel.close()
        except Exception:
            logger.exception(
                "Node %i: error while force-closing channel", self.id
            )

    async def _monitor_channel(self):
        while state := self._channel._state:
            logger.debug("node %i channel state: %s", self.id, state.value)
            try:
                await asyncio.wait_for(self._channel.__connect__(), timeout=2)
            except Exception:
                logger.debug("timeout for node, id: %i", self.id)
                self.set_status(NodeStatus.unhealthy, "timeout")
                self.synced = False
                if self._streaming_task:
                    self._streaming_task.cancel()
            else:
                if not self.synced:
                    try:
                        await self._sync()
                    except Exception as e:
                        real = _root_cause(e)
                        if _is_spurious_appdata_error(e) and real is not e:
                            error_msg = (
                                f"sync failed: {type(real).__name__}: "
                                f"{real} (node likely rejected the RPC; "
                                "check marznode logs on that node)"
                            )
                        else:
                            error_msg = (
                                f"sync failed: {type(e).__name__}: {e}"
                            )
                        logger.warning("Node %i: %s", self.id, error_msg)
                        self.set_status(NodeStatus.unhealthy, error_msg)
                        self._force_close_channel()
                    else:
                        self._streaming_task = asyncio.create_task(
                            self._stream_user_updates()
                        )
                        self.set_status(NodeStatus.healthy)
                        logger.info("Connected to node %i", self.id)
            await asyncio.sleep(10)

    async def _stream_user_updates(self):
        try:
            async with self._stub.SyncUsers.open() as stream:
                logger.debug("opened the stream")
                while True:
                    user_update = await self._updates_queue.get()
                    logger.debug("got something from queue")
                    user = user_update["user"]
                    await stream.send_message(
                        UserData(
                            user=User(
                                id=user.id,
                                username=user.username,
                                key=user.key,
                            ),
                            inbounds=[
                                Inbound(tag=t) for t in user_update["inbounds"]
                            ],
                        )
                    )
        except asyncio.CancelledError:
            raise
        except (OSError, ConnectionError, GRPCError, StreamTerminatedError) as e:
            logger.info("node %i detached: %s", self.id, e)
        except Exception:
            # Catch-all so a transient internal error (e.g. AttributeError
            # from grpclib/h2 on a torn-down channel) does not silently
            # kill the streaming task and leave self.synced=True forever,
            # which would deadlock the bounded _updates_queue.
            logger.exception(
                "node %i: unexpected error in _stream_user_updates", self.id
            )
            self._force_close_channel()
        finally:
            self.synced = False

    async def update_user(self, user, inbounds: set[str] | None = None):
        if inbounds is None:
            inbounds = set()

        # If the streaming task is dead (e.g. channel was torn down), the
        # bounded queue would silently fill up and every subsequent
        # update_user() would deadlock. Drop the update with a clear log
        # instead of blocking forever — the next reconcile cycle on the
        # node side and/or _monitor_channel reconnect will fix state.
        streaming_alive = (
            self._streaming_task is not None and not self._streaming_task.done()
        )
        if not streaming_alive or not self.synced:
            logger.warning(
                "Node %i: dropping user update (streaming alive=%s, "
                "synced=%s) for user id=%s",
                self.id,
                streaming_alive,
                self.synced,
                getattr(user, "id", "?"),
            )
            return

        payload = {"user": user, "inbounds": inbounds}
        try:
            self._updates_queue.put_nowait(payload)
        except asyncio.QueueFull:
            logger.warning(
                "Node %i: _updates_queue full, dropping user update for "
                "id=%s — node likely behind, will be resynced on reconnect",
                self.id,
                getattr(user, "id", "?"),
            )

    async def _repopulate_users(self, users_data: list[dict]) -> None:
        updates = [
            UserData(
                user=User(id=u["id"], username=u["username"], key=u["key"]),
                inbounds=[Inbound(tag=t) for t in u["inbounds"]],
            )
            for u in users_data
        ]
        await self._stub.RepopulateUsers(UsersData(users_data=updates))

    async def fetch_users_stats(self):
        response = await self._stub.FetchUsersStats(Empty())
        return response.users_stats

    async def _fetch_backends(self) -> list:
        response = await self._stub.FetchBackends(Empty())
        return response.backends

    async def _sync(self):
        backends = await self._fetch_backends()
        self.store_backends(backends)
        users = self.list_users()
        await self._repopulate_users(users)
        self.synced = True

    async def get_logs(self, name: str = "xray", include_buffer=True):
        async with self._stub.StreamBackendLogs.open() as stm:
            await stm.send_message(
                BackendLogsRequest(
                    backend_name=name, include_buffer=include_buffer
                )
            )
            while True:
                response = await stm.recv_message()
                yield response.line

    async def restart_backend(
        self, name: str, config: str, config_format: int
    ):
        try:
            await self._stub.RestartBackend(
                RestartBackendRequest(
                    backend_name=name,
                    config=BackendConfig(
                        configuration=config, config_format=config_format
                    ),
                )
            )
            await self._sync()
        except asyncio.CancelledError:
            raise
        except Exception:
            # Log the full traceback so obscure errors (e.g. AttributeError
            # on a torn-down channel) are localized instead of only the
            # bare message bubbling up to the API caller.
            logger.exception(
                "node %i: restart_backend(%s) failed", self.id, name
            )
            self.synced = False
            self.set_status(NodeStatus.unhealthy)
            # Drop the protocol so the monitor loop rebuilds the SSL
            # transport instead of hammering the dead one with every
            # retry from the panel UI.
            self._force_close_channel()
            raise
        else:
            self.set_status(NodeStatus.healthy)

    async def get_backend_config(self, name: str):
        response: BackendConfig = await self._stub.FetchBackendConfig(
            Backend(name=name)
        )
        return response.configuration, response.config_format

    async def get_backend_stats(self, name: str):
        response: BackendStats = await self._stub.GetBackendStats(
            Backend(name=name)
        )
        return response
