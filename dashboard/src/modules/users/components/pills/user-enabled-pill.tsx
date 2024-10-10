import { type FC } from "react";
import { BooleanPill } from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import { UserProp } from "@marzneshin/modules/users";

export const UserEnabledPill: FC<UserProp> = ({ user }) => {
    const { t } = useTranslation();
    return (
        <BooleanPill
            active={user.enabled}
            activeLabel={t('enabled')}
            inactiveLabel={t('disabled')}
        />
    )
}
