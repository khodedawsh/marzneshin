import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { ServiceType } from "../types";

interface ServiceResponse {
    id: number
    name: string
    users: any[]
    inbounds: any[]
    user_ids: number[]
    inbound_ids: number[]
}

export async function fetchServices(): Promise<ServiceType[]> {
    return fetch('/services').then((result) => {
        const services: ServiceType[] = result.items.map((fetchedService: ServiceResponse) => {
            const service: ServiceType = fetchedService;
            service.users = fetchedService.user_ids
            service.inbounds = fetchedService.inbound_ids
            return service
        })
        return services;
    });
}

export const ServicesQueryFetchKey = "services";

export const useServicesQuery = () => {
    return useQuery({
        queryKey: [ServicesQueryFetchKey],
        queryFn: fetchServices,
        initialData: []
    })
}
