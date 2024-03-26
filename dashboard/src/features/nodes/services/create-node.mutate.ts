import { NodeType, NodesQueryFetchKey } from "@marzneshin/features/nodes";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchCreateNode(node: NodeType): Promise<NodeType> {
    return fetch('/nodes', { method: 'post', body: node }).then((node) => {
        return node;
    });
}

const handleError = (error: Error, value: NodeType) => {
    toast.error(
        i18n.t('events.create.error', { name: value.name }),
        {
            description: error.message
        })
}

const handleSuccess = (value: NodeType) => {
    toast.success(
        i18n.t('events.create.success.title', { name: value.name }),
        {
            description: i18n.t('events.create.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [NodesQueryFetchKey] })
}


const NodesCreateFetchKey = "nodes";

export const useNodesCreationMutation = () => {
    return useMutation({
        mutationKey: [NodesCreateFetchKey],
        mutationFn: fetchCreateNode,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
