import { InboundType } from "@marzneshin/features/inbounds";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";

export async function fetchInbound({ queryKey }: { queryKey: [string, number] }): Promise<InboundType> {
    return fetch(`/inbounds/${queryKey[1]}`).then((result) => result);
}

export const InboundsQueryFetchKey = "inbounds";

export const useInboundQuery = ({ inboundId }: { inboundId: number }) => {
    return useQuery({
        queryKey: [InboundsQueryFetchKey, inboundId],
        queryFn: fetchInbound,
        initialData: undefined
    })
}
