
import { FC } from "react";
import { DataTable } from "@marzneshin/components";
import { columns } from "./columns";
import { useUsersServiceQuery } from "../../services/service-users.query";
import { ServiceType } from "../..";

interface ServicesUsersTableProps {
    service: ServiceType
}

export const ServicesUsersTable: FC<ServicesUsersTableProps> = ({ service }) => {
    const { data } = useUsersServiceQuery(service);

    return (
        <div>
            <DataTable
                columns={columns}
                data={data}
                filteredColumn='username'
            />
        </div>
    )
}
