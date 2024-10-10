import { type FC } from "react";
import { BooleanPill } from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import { UserProp } from "@marzneshin/modules/users";

export const UserDataLimitReachedPill: FC<UserProp> = ({ user }) => {
    const { t } = useTranslation();
    return (
        <BooleanPill
            active={!user.data_limit_reached}
            activeLabel={t('left')}
            inactiveLabel={t('reached')}
        />
    )
}
