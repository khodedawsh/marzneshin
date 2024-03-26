import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import { ServicesQueryFetchKey } from "./services.query";
import { ServiceType } from "../types";

export async function updateService(node: ServiceType): Promise<ServiceType> {
    return fetch(`/services/${node.id}`, { method: 'put', body: node }).then((service) => {
        return service;
    });
}

const handleError = (error: Error, value: ServiceType) => {
    toast.error(
        i18n.t('events.update.error', { name: value.name }),
        {
            description: error.message
        })
}

const handleSuccess = (value: ServiceType) => {
    toast.success(
        i18n.t('events.update.success.title', { name: value.name }),
        {
            description: i18n.t('events.update.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [ServicesQueryFetchKey] })
}


const ServicesUpdateFetchKey = "services-create-fetch-key";

export const useServicesUpdateMutation = () => {
    return useMutation({
        mutationKey: [ServicesUpdateFetchKey],
        mutationFn: updateService,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
