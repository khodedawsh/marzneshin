
import { type FC } from "react";
import { Badge } from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import { UserProp } from "@marzneshin/modules/users";

export const UserExpireStrategyPill: FC<UserProp> = ({ user }) => {
    const { t } = useTranslation();
    const label = {
        start_on_first_use: t("page.users.on_first_use"),
        fixed_date: t("page.users.fixed_date"),
        never: t("page.users.never"),
    }[user.expire_strategy]
    const variant = {
        start_on_first_use: "royal",
        fixed_date: "warning",
        never: "disabled",
    }[user.expire_strategy]
    return (
        <Badge variant={variant as "royal" | "disabled" | "warning"}>
            {label}
        </Badge>
    )
}

