import { UserMutationType, UsersQueryFetchKey } from "@marzneshin/modules/users";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchCreateUser(user: UserMutationType): Promise<UserMutationType> {
    return fetch('/users', { method: 'post', body: user }).then((user) => {
        return user;
    });
}

const handleError = (error: Error, value: UserMutationType) => {
    toast.error(
        i18n.t('events.create.error', { name: value.username }),
        {
            description: error.message
        })
}

const handleSuccess = (value: UserMutationType) => {
    toast.success(
        i18n.t('events.create.success.title', { name: value.username }),
        {
            description: i18n.t('events.create.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [UsersQueryFetchKey] })
}


const UsersCreateFetchKey = "users";

export const useUsersCreationMutation = () => {
    return useMutation({
        mutationKey: [UsersCreateFetchKey],
        mutationFn: fetchCreateUser,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
