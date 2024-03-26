
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { InboundType } from "../types";

export async function fetchInbounds(): Promise<InboundType[]> {
    return fetch('/inbounds').then((result) => {
        return result.items
    });
}

export const InboundsQueryFetchKey = "inbounds";

export const useInboundsQuery = () => {
    return useQuery({
        queryKey: [InboundsQueryFetchKey],
        queryFn: fetchInbounds,
        initialData: []
    })
}
