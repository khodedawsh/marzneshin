import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { ServiceType } from "../types";
import { UserType } from "@marzneshin/features/users";

interface ServiceResponse {
    id: number
    name: string
    inbounds: any[]
    user_ids: number[]
    inbound_ids: number[]
    users: UserType[]
}

export async function fetchUsersService({ queryKey }: { queryKey: [string, number] }): Promise<UserType[]> {
    return fetch('/services').then((result) => {
        const users: UserType[] =
            result.items
                .find((fetchedService: ServiceResponse) => fetchedService.id === queryKey[1])
                .users
        return users;
    });
}

export const ServicesQueryFetchKey = "services";

export const useUsersServiceQuery = (service: ServiceType) => {
    return useQuery({
        queryKey: [ServicesQueryFetchKey, service.id],
        queryFn: fetchUsersService,
        initialData: []
    })
}
