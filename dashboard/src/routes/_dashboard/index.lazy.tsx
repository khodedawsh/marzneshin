import { createFileRoute } from '@tanstack/react-router'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Page,
} from '@marzneshin/components';
import { UsersStatsWidget, useUsersStatsQuery } from '@marzneshin/modules/users';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';

export const DashboardPage: FC = () => {
    const { t } = useTranslation();
    const { data: stats } = useUsersStatsQuery()

    return (
        <Page>
            <Card className="border-0 sm:w-screen md:w-full">
                <CardHeader>
                    <CardTitle>
                        {t('home')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="md:flex">
                    <UsersStatsWidget {...stats} />
                </CardContent>
            </Card>
        </Page>
    )
};


export const Route = createFileRoute('/_dashboard/')({
    component: () => <DashboardPage />
})
