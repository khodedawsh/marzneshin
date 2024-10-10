import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Page,
    Loading,
} from '@marzneshin/components';
import { UsersNoServiceAlert, UsersTable } from '@marzneshin/modules/users';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { type FC, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

export const UsersPage: FC = () => {
    const { t } = useTranslation();
    return (
        <Page>
            <Card className="border-0 sm:w-screen md:w-full">
                <CardHeader>
                    <CardTitle>
                        {t('users')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <UsersTable />
                    <Suspense fallback={<Loading />}>
                        <Outlet />
                    </Suspense>
                </CardContent>
                <CardFooter>
                    <UsersNoServiceAlert />
                </CardFooter>
            </Card>
        </Page>
    )
};

export const Route = createFileRoute('/_dashboard/users')({
    component: () => <UsersPage />,
})
