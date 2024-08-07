import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    HostsMutationDialog,
    useRouterHostContext,
} from "@marzneshin/features/hosts";

const HostEdit = () => {
    const value = useRouterHostContext()
    const navigate = useNavigate({ from: "/hosts/$hostId/edit" });

    return value && (
        <HostsMutationDialog
            entity={value.host}
            onClose={() => navigate({ to: "/hosts" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$hostId/edit')({
    component: HostEdit
})
