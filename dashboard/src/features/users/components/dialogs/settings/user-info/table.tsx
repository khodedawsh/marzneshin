import {
    Card,
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
import {
    type UserProp,
    UserEnabledPill,
    UserUsedTraffic,
    UserActivatedPill,
    UserDataLimitReachedPill,
    UserExpiredPill,
} from "@marzneshin/features/users";
import { useTranslation } from "react-i18next";

export const UserInfoTable: FC<UserProp> = ({ user: entity }) => {
    const { t } = useTranslation();
    const expireDate = entity.expire_date ? new Date(entity.expire_date) : null;

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center w-full">
                <CardTitle>{t("user_info")}</CardTitle>
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
                        {entity.online_at ? (
                            <DateTableRow
                                label={t("page.users.online_at")}
                                date={entity.online_at}
                                withTime
                            />
                        ) : (
                            <TableRowWithCell
                                label={t("page.users.online_at")}
                                value={<Badge>{t("page.users.no_use")}</Badge>}
                            />
                        )}
                        <DateTableRow
                            label={t("page.users.created_at")}
                            date={entity.created_at}
                        />
                        <TableRowWithCell label={t("note")} value={entity.note} />
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
