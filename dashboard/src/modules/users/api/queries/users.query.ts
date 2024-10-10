import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { UserType } from "../types";
import {
    FetchEntityReturn,
    UseEntityQueryProps,
    EntityQueryKeyType
} from "@marzneshin/features/entity-table";

export type SortUserBy = "username" | "used_traffic" | "data_limit" | "expire_date" | "created_at"

export async function fetchUsers({ queryKey }: EntityQueryKeyType): FetchEntityReturn<UserType> {
    const pagination = queryKey[1];
    const primaryFilter = queryKey[2];
    const filters = queryKey[4].filters;
    return fetch(`/users`, {
        query: {
            page: pagination.page === 0 ? 1 : pagination.page,
            size: pagination.size,
            ...filters,
            username: primaryFilter,
            descending: queryKey[3].desc,
            order_by: queryKey[3].sortBy,
        }
    }).then((result) => {
        return {
            entities: result.items,
            pageCount: result.pages
        };
    });
}

export const UsersQueryFetchKey = "users";

export const useUsersQuery = ({
    page, size, sortBy = "created_at", desc = false, filters = {}
}: UseEntityQueryProps) => {
    return useQuery({
        queryKey: [UsersQueryFetchKey, { page, size }, filters?.username ?? "", { sortBy, desc }, { filters }],
        queryFn: fetchUsers,
        initialData: { entities: [], pageCount: 0 }
    })
}
