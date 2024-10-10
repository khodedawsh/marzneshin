import { Button } from "@marzneshin/components";
import { cn } from "@marzneshin/utils";
import { UserType, useUserStatusEnable } from "@marzneshin/modules/users";
import { LoaderIcon, UserCheck, UserX } from "lucide-react";
import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface UserStatusEnableButtonProps {
    user: UserType;
}

export const UserStatusEnableButton: FC<UserStatusEnableButtonProps> = ({ user }) => {
    const [userStatus, setUserStatus] = useState<boolean>(user.enabled)
    const { t } = useTranslation()
    const { mutate: userStatusEnable, isPending } = useUserStatusEnable()

    const handleUserStatusEnabledToggle = useCallback(() => {
        const tempUserStatus = userStatus;
        userStatusEnable({ user: user, enabled: !userStatus })
        setUserStatus(!tempUserStatus)
    }, [user, userStatus, userStatusEnable]);

    const bgColor = isPending ? 'bg-muted-foreground' : (userStatus ? 'bg-destructive' : 'bg-success')

    return (
        <Button
            className={cn(bgColor, "rounded-2xl")}
            onClick={handleUserStatusEnabledToggle}
        >
            {!userStatus ? <UserCheck className="mr-2" /> : <UserX className="mr-2" />}
            {isPending ? <LoaderIcon className="animate-spin" /> : t(!userStatus ? 'enable' : 'disable')}
        </Button>
    )
}
