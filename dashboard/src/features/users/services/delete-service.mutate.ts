import { UserType, UsersQueryFetchKey } from "@marzneshin/features/users";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchDeleteUser(user: UserType): Promise<UserType> {
    return fetch(`/users/${user.username}`, { method: 'delete' }).then((user) => {
        return user;
    });
}

const UsersDeleteFetchKey = "users-delete-fetch-key";


const handleError = (error: Error, value: UserType) => {
    toast.error(
        i18n.t('events.delete.error', { name: value.username }),
        {
            description: error.message
        })
}

const handleSuccess = (value: UserType) => {
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
