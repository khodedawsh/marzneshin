
import { FC, useCallback, useEffect, useState } from "react";
import {
    useInboundsQuery,
} from '@marzneshin/features/inbounds';
import { Button, DataTable } from "@marzneshin/components";
import { columns } from "./columns";
import { ServiceType, useServicesUpdateMutation } from "../..";
import { useTranslation } from "react-i18next";
import { RowSelectionState } from "@tanstack/react-table";

interface ServiceInboundsTableProps {
    service: ServiceType
}

export const ServiceInboundsTable: FC<ServiceInboundsTableProps> = ({ service }) => {
    const { mutate: updateService } = useServicesUpdateMutation();
    const { data } = useInboundsQuery();
    const [selectedInbound, setSelectedInbound] = useState<{ [key: number]: boolean }>({})
    const { t } = useTranslation()

    useEffect(() => {
        setSelectedInbound((prevSelected) => {
            const updatedSelected: RowSelectionState = { ...prevSelected };
            service.inbounds.forEach((inboundId) => {
                data.forEach((fetchedInbound, i) => {
                    if (fetchedInbound.id === inboundId) {
                        updatedSelected[i] = true;
                    }
                });
            });
            return updatedSelected;
        });
    }, [data, service.inbounds])

    const handleApply = useCallback(() => {
        const selectedInboundIds = Object.keys(selectedInbound)
            .filter(key => selectedInbound[parseInt(key)])
            .map(key => data[parseInt(key)].id);
        updateService({ ...service, inbounds: selectedInboundIds });
    }, [data, selectedInbound, service, updateService]);

    const disabled = (Object.keys(selectedInbound).length < 1) ? true : false

    return (
        <div className="flex flex-col gap-4">
            <DataTable
                columns={columns}
                data={data}
                filteredColumn='tag'
                selectedRow={selectedInbound}
                setSelectedRow={setSelectedInbound}
            />

            <Button onClick={handleApply} disabled={disabled}>{t('apply')}</Button>
        </div>
    )
}
