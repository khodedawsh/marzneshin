import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UsersMutationDialog } from "@marzneshin/modules/users";

const UserCreate = () => {
    const navigate = useNavigate({ from: "/users/create" });
    return (
        <UsersMutationDialog
            entity={null}
            onClose={() => navigate({ to: "/users" })}
        />
    );
}

export const Route = createFileRoute("/_dashboard/users/create")({
    component: UserCreate,
});
