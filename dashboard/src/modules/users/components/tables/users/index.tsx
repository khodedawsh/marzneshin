import type { FC } from "react";
import { fetchUsers, UserType, UsersQueryFetchKey } from "@marzneshin/modules/users";
import { columns as columnsFn } from "./columns";
import { EntityTable } from "@marzneshin/features/entity-table";
import { useAuth } from "@marzneshin/features/auth";
import { useNavigate } from "@tanstack/react-router";

export const UsersTable: FC = () => {
    const navigate = useNavigate({ from: "/users" });
    const { isSudo } = useAuth();

    const onOpen = (entity: UserType) => {
        navigate({
            to: "/users/$userId",
            params: { userId: entity.username },
        })
    }

    const onEdit = (entity: UserType) => {
        navigate({
            to: "/users/$userId/edit",
            params: { userId: entity.username },
        })
    }

    const onDelete = (entity: UserType) => {
        navigate({
            to: "/users/$userId/delete",
            params: { userId: entity.username },
        })
    }

    const columns = columnsFn({ onEdit, onDelete, onOpen });
    const noneSudoColumns = columns.filter((column) => !column.sudoVisibleOnly);

    return (
        <EntityTable
            fetchEntity={fetchUsers}
            columns={isSudo() ? columns : noneSudoColumns}
            primaryFilter="username"
            entityKey={UsersQueryFetchKey}
            onCreate={() => navigate({ to: "/users/create" })}
            onOpen={onOpen}
        />
    );
};
