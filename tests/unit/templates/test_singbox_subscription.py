"""Инварианты клиентского шаблона подписки sing-box 1.13."""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path
from uuid import UUID

import pytest
from v2share import SingBoxConfig, V2Data

TEMPLATE_PATH = (
    Path(__file__).resolve().parents[3] / "app" / "templates" / "sing-box.json"
)

# Фиктивный Reality public key в формате sing-box (URL-safe base64 без padding).
DUMMY_REALITY_PUBLIC_KEY = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"


class TestSingBoxSubscriptionTemplate:
    def setup_method(self) -> None:
        self.under_test = json.loads(TEMPLATE_PATH.read_text(encoding="utf-8"))

    def test_load_happy_path(self) -> None:
        # given / when / then
        assert isinstance(self.under_test, dict)
        assert "dns" in self.under_test
        assert "outbounds" in self.under_test
        assert "route" in self.under_test

    def test_dns_servers_use_typed_schema_not_legacy_address(self) -> None:
        # given
        servers = self.under_test["dns"]["servers"]

        # when / then
        assert servers, "ожидаем хотя бы один DNS-сервер"
        for server in servers:
            assert "type" in server, f"у DNS-сервера {server!r} нет поля type"
            assert "address" not in server

        types = {server["type"] for server in servers}
        assert "udp" in types
        assert "local" in types

    def test_outbounds_have_no_legacy_dns_type(self) -> None:
        # given
        outbound_types = [item["type"] for item in self.under_test["outbounds"]]

        # when / then
        assert "dns" not in outbound_types
        assert "selector" in outbound_types
        assert "urltest" in outbound_types
        assert "direct" in outbound_types
        assert "block" in outbound_types

    def test_route_uses_default_domain_resolver_not_store_dns(self) -> None:
        # given
        route = self.under_test["route"]
        cache_file = self.under_test["experimental"]["cache_file"]

        # when / then
        assert route["default_domain_resolver"] == "dns-local"
        assert cache_file.get("store_rdrc") is True
        assert "store_dns" not in cache_file

    def test_v2share_render_happy_path(self) -> None:
        # given
        rendered = json.loads(self._render_with_dummy_vless())

        # when
        dns_types = [server["type"] for server in rendered["dns"]["servers"]]
        outbound_types = [item["type"] for item in rendered["outbounds"]]

        # then
        assert "udp" in dns_types
        assert "local" in dns_types
        assert "dns" not in outbound_types
        assert "vless" in outbound_types
        selector = next(
            item for item in rendered["outbounds"] if item["type"] == "selector"
        )
        assert selector["outbounds"], "v2share должен заполнить selector.outbounds"

    def test_sing_box_check_accepts_rendered_config(self, tmp_path: Path) -> None:
        # given
        sing_box = shutil.which("sing-box")
        if sing_box is None:
            pytest.skip("sing-box не установлен")
        version = subprocess.check_output(
            [sing_box, "version"], text=True, stderr=subprocess.STDOUT
        )
        if "1.13." not in version:
            pytest.skip(f"нужен sing-box 1.13.x, установлен: {version.splitlines()[0]}")

        config_path = tmp_path / "sing-box-check.json"
        config_path.write_text(self._render_with_dummy_vless(), encoding="utf-8")

        # when
        completed = subprocess.run(
            [sing_box, "check", "-c", str(config_path)],
            check=False,
            capture_output=True,
            text=True,
        )

        # then
        assert completed.returncode == 0, (
            completed.stderr or completed.stdout or "sing-box check failed"
        )
        combined = f"{completed.stdout}\n{completed.stderr}".lower()
        assert "fatal" not in combined

    @staticmethod
    def _render_with_dummy_vless() -> str:
        handler = SingBoxConfig(template_path=str(TEMPLATE_PATH))
        handler.add_proxies(
            [
                V2Data(
                    protocol="vless",
                    remark="dummy-vless",
                    address="127.0.0.1",
                    port=443,
                    uuid=UUID("00000000-0000-4000-8000-000000000000"),
                    tls="reality",
                    sni="www.google.com",
                    fingerprint="chrome",
                    reality_pbk=DUMMY_REALITY_PUBLIC_KEY,
                    reality_sid="aabbccdd",
                )
            ]
        )
        return handler.render(sort=False, shuffle=False)
