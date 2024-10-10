import {
    Card,
    Button,
    CardContent,
    CardHeader,
    CardTitle,
    Table,
    TableBody,
    TableRowWithCell,
    DateTableRow,
    Badge
} from "@marzneshin/components";
import type { FC } from "react";
import { UserStatusEnableButton } from "./user-status-enable-button";
import {
    type UserProp,
    UserEnabledPill,
    UserUsedTraffic,
    UserActivatedPill,
    useUserUsageResetCmd,
    UserDataLimitReachedPill,
    UserExpiredPill,
} from "@marzneshin/modules/users";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { format } from '@chbphone55/pretty-bytes';
import { TimerReset } from "lucide-react";

export const UserInfoTable: FC<UserProp> = ({ user: entity }) => {
    const { t } = useTranslation();
    const expireDate = entity.expire_date ? new Date(entity.expire_date) : null;
    const { mutate: resetUsage } = useUserUsageResetCmd();
    const lifetimeUsedTrafficByte = format(entity.lifetime_used_traffic);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center w-full">
                <CardTitle>{t("user_info")}</CardTitle>
                <div className="hstack justify-center items-center gap-2">
                    <Button
                        className="rounded-2xl"
                        onClick={() => resetUsage(entity)}
                    >
                        <TimerReset className="mr-2" />
                        <span>{t("page.users.reset_usage")}</span>
                    </Button>
                    <UserStatusEnableButton user={entity} />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRowWithCell label={t("username")} value={entity.username} />
                        <TableRowWithCell
                            label={t("activated")}
                            value={<UserActivatedPill user={entity} />}
                        />
                        <TableRowWithCell
                            label={t("enabled")}
                            value={<UserEnabledPill user={entity} />}
                        />
                        <TableRowWithCell
                            label={t("page.users.data_limit_reached")}
                            value={<UserDataLimitReachedPill user={entity} />}
                        />
                        <TableRowWithCell
                            label={t("expired")}
                            value={<UserExpiredPill user={entity} />}
                        />
                        {
                            {
                                fixed_date: (
                                    <DateTableRow
                                        label={t("page.users.expire_date")}
                                        date={expireDate}
                                    />
                                ),
                                start_on_first_use: (
                                    <>
                                        <TableRowWithCell
                                            label={t("page.users.usage_duration")}
                                            value={
                                                (entity.usage_duration ? entity.usage_duration : 0) /
                                                86400
                                            }
                                        />
                                        <DateTableRow
                                            label={t("page.users.activation_deadline")}
                                            date={entity.activation_deadline}
                                        />
                                    </>
                                ),
                                never: (
                                    <TableRowWithCell
                                        label={t("page.users.expire_method")}
                                        value={t("never")}
                                    />
                                ),
                            }[entity.expire_strategy]
                        }
                        <TableRowWithCell
                            label={t("page.users.used_traffic")}
                            value={<UserUsedTraffic user={entity} />}
                        />
                        <DateTableRow
                            label={t("page.users.traffic_reset_at")}
                            date={entity.traffic_reset_at}
                            withTime
                        />
                        <TableRowWithCell
                            label={t("page.users.lifetime_used_traffic")}
                            value={`${lifetimeUsedTrafficByte[0]} ${lifetimeUsedTrafficByte[1]}`}
                        />
                        {entity.online_at ? (
                            <TableRowWithCell
                                label={t("page.users.online_at")}
                                value={formatDistanceToNow(new Date(entity.online_at + "Z")) + " ago"}
                            />
                        ) : (
                            <TableRowWithCell
                                label={t("page.users.online_at")}
                                value={<Badge>{t("page.users.no_use")}</Badge>}
                            />
                        )}
                        <DateTableRow
                            label={t("page.users.sub_updated_at")}
                            date={entity.sub_updated_at}
                            withTime
                        />
                        <TableRowWithCell
                            label={t("page.users.sub_last_user_agent")}
                            value={entity.sub_last_user_agent}
                        />
                        <DateTableRow
                            label={t("page.users.created_at")}
                            date={entity.created_at}
                            withTime
                        />
                        <TableRowWithCell label={t("note")} value={entity.note} />
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
