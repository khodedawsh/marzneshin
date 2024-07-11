import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import {
    AdminsQueryFetchKey,
    AdminMutation
} from "@marzneshin/features/admins";

export async function updateAdmin(admin: AdminMutation): Promise<AdminMutation> {
    return fetch(`/admins/${admin.username}`, { method: 'put', body: admin }).then((admin) => {
        return admin;
    });
}

const handleError = (error: Error, value: AdminMutation) => {
    toast.error(
        i18n.t('events.update.error', { name: value.username }),
        {
            description: error.message
        })
}

const handleSuccess = (value: AdminMutation) => {
    toast.success(
        i18n.t('events.update.success.title', { name: value.username }),
        {
            description: i18n.t('events.update.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [AdminsQueryFetchKey] })
}


const AdminsUpdateFetchKey = "admins";

export const useAdminsUpdateMutation = () => {
    return useMutation({
        mutationKey: [AdminsUpdateFetchKey],
        mutationFn: updateAdmin,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
