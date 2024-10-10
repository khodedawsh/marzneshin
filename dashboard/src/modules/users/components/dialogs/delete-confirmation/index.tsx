import { DeleteConfirmation } from "@marzneshin/components";
import { type FC, useEffect } from "react";
import {
    type UserMutationType,
    useUsersDeletionMutation,
} from "@marzneshin/modules/users";

interface UsersDeleteConfirmationDialogProps {
    onOpenChange: (state: boolean) => void;
    open: boolean;
    entity: UserMutationType;
    onClose: () => void;
}

export const UsersDeleteConfirmationDialog: FC<
    UsersDeleteConfirmationDialogProps
> = ({ onOpenChange, open, entity, onClose }) => {
    const deleteMutation = useUsersDeletionMutation();

    useEffect(() => {
        if (!open) onClose();
    }, [open, onClose]);

    return (
        <DeleteConfirmation
            open={open}
            onOpenChange={onOpenChange}
            action={() => deleteMutation.mutate(entity)}
        />
    );
};
