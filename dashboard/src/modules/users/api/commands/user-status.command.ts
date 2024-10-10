import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import {
    UserMutationType,
} from "@marzneshin/modules/users";


interface UsersStatusEnabledQuery {
    user: UserMutationType;
    enabled: boolean;
}

export async function userStatusEnabled({ user, enabled }: UsersStatusEnabledQuery): Promise<UserMutationType> {
    const action = enabled ? 'enable' : 'disable';
    return fetch(`/users/${user.username}/${action}`, { method: 'post' }).then((user) => {
        return user;
    });
}

const handleError = (error: Error, value: UsersStatusEnabledQuery) => {
    toast.error(
        i18n.t('events.user_status.error', { name: value.user.username }),
        {
            description: error.message
        })
}

const handleSuccess = (value: UserMutationType) => {
    toast.success(
        i18n.t('events.user_status.success.title', { name: value.username }),
        {
            description: i18n.t('events.user_status.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [UsersStatusEnabledFetchKey] })
    queryClient.invalidateQueries({ queryKey: [UsersStatusEnabledFetchKey, value.username] })
}


const UsersStatusEnabledFetchKey = "users";

export const useUserStatusEnable = () => {
    return useMutation({
        mutationKey: [UsersStatusEnabledFetchKey],
        mutationFn: userStatusEnabled,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
