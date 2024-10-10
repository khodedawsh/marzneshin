import { UserMutationType, UsersQueryFetchKey } from "@marzneshin/modules/users";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchDeleteUser(user: UserMutationType): Promise<UserMutationType> {
    return fetch(`/users/${user.username}`, { method: 'delete' }).then((user) => {
        return user;
    });
}

const UsersDeleteFetchKey = "users";


const handleError = (error: Error, value: UserMutationType) => {
    toast.error(
        i18n.t('events.delete.error', { name: value.username }),
        {
            description: error.message
        })
}

const handleSuccess = (value: UserMutationType) => {
    toast.success(
        i18n.t('events.delete.success.title', { name: value.username }),
        {
            description: i18n.t('events.delete.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [UsersQueryFetchKey] })
}

export const useUsersDeletionMutation = () => {
    return useMutation({
        mutationKey: [UsersDeleteFetchKey],
        mutationFn: fetchDeleteUser,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
