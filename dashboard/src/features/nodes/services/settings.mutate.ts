import { NodeType } from "@marzneshin/features/nodes";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import { NodesSettingsQueryFetchKey } from "./settings.query";

export async function fetchUpdateNodesSettings(node: NodeType): Promise<NodeType> {
    return fetch(`/nodes/${node.id}/xray_config`, { method: 'put', body: node }).then((node) => {
        return node;
    });
}

const handleError = (error: Error, value: NodeType) => {
    toast.error(
        i18n.t('events.update.error', { name: value.name }),
        {
            description: error.message
        })
}

const handleSuccess = (value: NodeType) => {
    toast.success(
        i18n.t('events.update.success.title', { name: value.name }),
        {
            description: i18n.t('events.update.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [NodesSettingsQueryFetchKey] })
}


const NodesSettingsUpdateFetchKey = ["nodes", "xray_config"];

export const useNodesSettingsMutation = () => {
    return useMutation({
        mutationKey: NodesSettingsUpdateFetchKey,
        mutationFn: fetchUpdateNodesSettings,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
