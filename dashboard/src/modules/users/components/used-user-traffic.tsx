import { FC } from 'react'
import { UserType } from '@marzneshin/modules/users';
import { CircularProgress } from '@nextui-org/progress';
import { format } from '@chbphone55/pretty-bytes';
import { useTranslation } from 'react-i18next';


interface UserUsedTrafficProps {
    user: UserType
}

export const UserUsedTraffic: FC<UserUsedTrafficProps> = (
    { user }
) => {
    const { t } = useTranslation()
    const formattedUsedTraffic = format(user.used_traffic)
    const formattedDatalimit = (user.data_limit != null) ? format(user.data_limit) : []
    return (
        <div className="flex gap-x-5 justify-start items-center">
            <CircularProgress
                value={user.data_limit ? (user.used_traffic / user.data_limit * 100) : 0}
                size='sm'
                showValueLabel
            />
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {formattedUsedTraffic[0]} {formattedUsedTraffic[1]}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                    {user.data_limit ? `${formattedDatalimit[0]} ${formattedDatalimit[1]}` : t('page.users.unlimited')}
                </p>
            </div>
        </div>
    );
}
