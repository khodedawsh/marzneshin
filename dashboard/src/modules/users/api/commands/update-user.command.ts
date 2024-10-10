import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import {
    UsersQueryFetchKey,
    UserMutationType
} from "@marzneshin/modules/users";

export async function updateUser(user: UserMutationType): Promise<UserMutationType> {
    return fetch(`/users/${user.username}`, { method: 'put', body: user }).then((user) => {
        return user;
    });
}

const handleError = (error: Error, value: UserMutationType) => {
    toast.error(
        i18n.t('events.update.error', { name: value.username }),
        {
            description: error.message
        })
}

const handleSuccess = (value: UserMutationType) => {
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
