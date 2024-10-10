import { format } from "date-fns";
import { type FC } from 'react'
import { UserProp } from "@marzneshin/modules/users";
import { useTranslation } from "react-i18next";

export const UserExpirationValue: FC<UserProp> = ({ user }) => {
    const { t } = useTranslation();
    return ({
        start_on_first_use: user.usage_duration && `${(user.usage_duration / 86400)} Day`,
        fixed_date: user.expire_date && format(user.expire_date?.toLocaleString(), "PPP"),
        never: t('never'),
    }[user.expire_strategy])
}

