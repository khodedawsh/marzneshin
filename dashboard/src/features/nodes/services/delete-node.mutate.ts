
import { NodeType, NodesQueryFetchKey } from "@marzneshin/features/nodes";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchDeleteNode(node: NodeType): Promise<NodeType> {
    return fetch(`/nodes/${node.id}`, { method: 'delete' }).then((node) => {
        return node;
    });
}

const NodesDeleteFetchKey = "nodes";


const handleError = (error: Error, value: NodeType) => {
    toast.error(
        i18n.t('events.delete.error', { name: value.name }),
        {
            description: error.message
        })
}

const handleSuccess = (value: NodeType) => {
    toast.success(
        i18n.t('events.delete.success.title', { name: value.name }),
        {
            description: i18n.t('events.delete.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [NodesQueryFetchKey] })
}

export const useNodesDeletionMutation = () => {
    return useMutation({
        mutationKey: [NodesDeleteFetchKey],
        mutationFn: fetchDeleteNode,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
