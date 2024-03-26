import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import { UsersQueryFetchKey } from "./users.query";
import { UserType } from "../types";

export async function updateUser(user: UserType): Promise<UserType> {
    return fetch(`/users/${user.username}`, { method: 'put', body: user }).then((user) => {
        return user;
    });
}

const handleError = (error: Error, value: UserType) => {
    toast.error(
        i18n.t('events.update.error', { name: value.username }),
        {
            description: error.message
        })
}

const handleSuccess = (value: UserType) => {
    toast.success(
        i18n.t('events.update.success.title', { name: value.username }),
        {
            description: i18n.t('events.update.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [UsersQueryFetchKey] })
}


const UsersUpdateFetchKey = "users";

export const useUsersUpdateMutation = () => {
    return useMutation({
        mutationKey: [UsersUpdateFetchKey],
        mutationFn: updateUser,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
