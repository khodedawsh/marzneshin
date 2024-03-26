import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { UserType } from "../types";

interface UserResponse extends UserType {
    service_ids: number[]
    services: any[]
}

export async function fetchUsers(): Promise<UserType[]> {
    return fetch('/users').then((result) => {
        const users: UserType[] = result.items.map((fetchedUser: UserResponse) => {
            const user: UserType = fetchedUser;
            user.services = fetchedUser.service_ids
            return user
        })
        return users;
    });
}

export const UsersQueryFetchKey = "users";

export const useUsersQuery = () => {
    return useQuery({
        queryKey: [UsersQueryFetchKey],
        queryFn: fetchUsers,
        initialData: []
    })
}
