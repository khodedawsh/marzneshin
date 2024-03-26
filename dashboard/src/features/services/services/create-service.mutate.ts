import { ServiceCreateType, ServicesQueryFetchKey } from "@marzneshin/features/services";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchCreateService(service: ServiceCreateType): Promise<ServiceCreateType> {
    return fetch('/services', { method: 'post', body: service }).then((service) => {
        return service;
    });
}

const handleError = (error: Error, value: ServiceCreateType) => {
    toast.error(
        i18n.t('events.create.error', { name: value.name }),
        {
            description: error.message
        })
}

const handleSuccess = (value: ServiceCreateType) => {
    toast.success(
        i18n.t('events.create.success.title', { name: value.name }),
        {
            description: i18n.t('events.create.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [ServicesQueryFetchKey] })
}


const ServicesCreateFetchKey = "services";

export const useServicesCreationMutation = () => {
    return useMutation({
        mutationKey: [ServicesCreateFetchKey],
        mutationFn: fetchCreateService,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
