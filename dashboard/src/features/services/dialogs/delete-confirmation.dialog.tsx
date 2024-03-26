
import { DeleteConfirmation } from '@marzneshin/components'
import { FC } from 'react'
import { ServiceType, useServicesDeletionMutation } from '@marzneshin/features/services'

interface ServicesDeleteConfirmationDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    service: ServiceType | null
}

export const ServicesDeleteConfirmationDialog: FC<ServicesDeleteConfirmationDialogProps> = ({ onOpenChange, open, service }) => {
    const deleteMutation = useServicesDeletionMutation();
    if (service !== null) {
        return (
            <DeleteConfirmation
                open={open}
                onOpenChange={onOpenChange}
                action={() => deleteMutation.mutate(service)}
            />
        )
    }
}
