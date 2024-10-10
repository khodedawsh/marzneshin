import { useServicesQuery } from '@marzneshin/features/services';
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next';
import {
    AlertCard,
} from '@marzneshin/components';

export const UsersNoServiceAlert = () => {
    const { t } = useTranslation();
    const { data } = useServicesQuery({ page: 1, size: 10 });
    return (data && data.pageCount === 0) && (
        <AlertCard
            title={t('page.users.services-alert.title')}
            desc={
                <>
                    {t('page.users.services-alert.desc')}
                    <Link className="m-1 font-semibold text-secondary-foreground" to="/services">{t('page.nodes.certificate-alert.click')}</Link>
                </>
            }
        />
    )
}

