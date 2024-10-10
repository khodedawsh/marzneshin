import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    UsersMutationDialog,
    useRouterUserContext,
} from "@marzneshin/modules/users";


const UserEdit = () => {
    const value = useRouterUserContext()
    const navigate = useNavigate({ from: "/users/$userId/edit" });

    return value && value.user && (
        <UsersMutationDialog
            entity={value.user}
            onClose={() => navigate({ to: "/users" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/users/$userId/edit')({
    component: UserEdit
})
