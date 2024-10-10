import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { UsersQueryFetchKey } from "../..";

export interface UsersStatsResponse {
    total: number;
    active: number;
    on_hold: number;
    expired: number;
    limited: number;
    online: number;
    recent_subscription_updates: string[]
}

export const UsersStatsDefault = {
    total: 0,
    active: 0,
    on_hold: 0,
    expired: 0,
    limited: 0,
    online: 0,
    recent_subscription_updates: []
}

export async function fetchUsersStats(): Promise<UsersStatsResponse> {
    return await fetch(`/system/stats/users`).then((result) => {
        return result;
    });
}

export const UsersStatsQueryFetchKey = "stats";

export const useUsersStatsQuery = () => {
    return useQuery({
        queryKey: [UsersStatsQueryFetchKey, UsersQueryFetchKey],
        queryFn: fetchUsersStats,
        initialData: UsersStatsDefault
    })
}
