import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { UserType } from "@marzneshin/modules/users";
import type {
    DoubleEntityQueryKeyType,
    UseEntityQueryProps,
    FetchEntityReturn
} from "@marzneshin/features/entity-table";

interface UseServiceUsersQueryProps extends UseEntityQueryProps {
    serviceId: number;
}

export async function fetchServiceUsers({ queryKey }: DoubleEntityQueryKeyType): FetchEntityReturn<UserType> {
    const pagination = queryKey[2];
    const primaryFilter = queryKey[3];
    return fetch(`/services/${queryKey[1]}/users`, {
        query: {
            ...pagination,
            username: primaryFilter,
        }
    }).then((result) => {
        return {
            entities: result.items,
            pageCount: result.pages,
        };
    });
}

const ServicesQueryFetchKey = "services";

export const useUsersServiceQuery = ({
    serviceId, page = 1, size = 50
}: UseServiceUsersQueryProps) => {
    return useQuery({
        queryKey: [ServicesQueryFetchKey, serviceId, { page, size }],
        queryFn: fetchServiceUsers,
        initialData: { entities: [], pageCount: 0 },
    })
}
