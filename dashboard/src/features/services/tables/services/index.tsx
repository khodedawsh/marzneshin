import { FC, useState } from "react";
import {
    useServicesQuery,
    ServiceType,
    MutationDialog,
    ServicesDeleteConfirmationDialog
} from '@marzneshin/features/services';
import { DataTable } from "@marzneshin/components";
import { columns } from "./columns";
import { ServiceSettingsDialog } from "../../dialogs/settings.dialog";

export const ServicesTable: FC = () => {
    const { data } = useServicesQuery();
    const [mutationDialogOpen, setMutationDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
    const [selectedService, selectService] = useState<ServiceType | null>(null);

    const onEdit = (service: ServiceType) => {
        selectService(service);
        setMutationDialogOpen(true);
    }

    const onDelete = (service: ServiceType) => {
        selectService(service);
        setDeleteDialogOpen(true);
    }

    const onCreate = () => {
        selectService(null);
        setMutationDialogOpen(true);
    }

    const onOpen = (service: ServiceType) => {
        selectService(service);
        setSettingsDialogOpen(true);
    }

    return (
        <div>
            <ServiceSettingsDialog
                open={settingsDialogOpen}
                onOpenChange={setSettingsDialogOpen}
                service={selectedService}
            />
            <ServicesDeleteConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                service={selectedService}
            />
            <MutationDialog
                service={selectedService}
                open={mutationDialogOpen}
                onOpenChange={setMutationDialogOpen}
            />
            <DataTable
                columns={columns({ onEdit, onDelete, onOpen })}
                data={data}
                filteredColumn='name'
                onCreate={onCreate}
                onOpen={onOpen}
            />
        </div>
    )
}
