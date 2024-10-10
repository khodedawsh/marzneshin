import { EntityFieldCard } from '@marzneshin/components';
import { ServiceType } from '@marzneshin/features/services';
import { ServerIcon, UserIcon } from 'lucide-react';
import { FC } from 'react'

interface ServiceCardProps {
    service: ServiceType
}


export const ServiceCard: FC<ServiceCardProps> = (
    { service }
) => {
    return (service.user_ids && service.inbound_ids) && (
        <EntityFieldCard
            FirstIcon={UserIcon}
            SecondIcon={ServerIcon}
            firstAmount={service.user_ids.length}
            secondAmount={service.inbound_ids.length}
            name={service.name}
        />
    )
};
