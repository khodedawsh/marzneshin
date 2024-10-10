import {
    ScrollArea,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Awaiting,
    SettingsInfoSkeleton,
    SettingsDialogProps,
    SettingsDialog,
} from "@marzneshin/components";
import {
    UserServicesTable,
    UserNodesUsageWidget,
    type UserType,
} from "@marzneshin/modules/users";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import {
    SubscriptionActions,
    QRCodeSection,
    UserInfoTable,
} from "./user-info";

interface UsersSettingsDialogProps extends SettingsDialogProps {
    entity: UserType | null;
    onClose: () => void;
    isPending: boolean;
}

export const UsersSettingsDialog: FC<UsersSettingsDialogProps> = ({
    onOpenChange,
    open,
    entity,
    onClose,
    isPending,
}) => {
    const { t } = useTranslation();

    return (
        <SettingsDialog open={open} onClose={onClose} onOpenChange={onOpenChange}>
            <Awaiting
                Component={
                    entity ? (
                        <ScrollArea className="flex flex-col gap-4 h-full">
                            <Tabs defaultValue="info" className="w-full h-full">
                                <TabsList className="w-full bg-accent">
                                    <TabsTrigger className="w-full" value="info">
                                        {t("user_info")}
                                    </TabsTrigger>
                                    <TabsTrigger className="w-full" value="services">
                                        {t("services")}
                                    </TabsTrigger>
                                    <TabsTrigger className="w-full" value="subscription">
                                        {t("subscription")}
                                    </TabsTrigger>
                                    <TabsTrigger className="w-full" value="nodes-usage">
                                        {t("nodes-usage")}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="info"
                                    className="flex flex-col gap-2 w-full h-full"
                                >
                                    <UserInfoTable user={entity} />
                                </TabsContent>
                                <TabsContent value="services">
                                    <UserServicesTable user={entity} />
                                </TabsContent>
                                <TabsContent value="subscription">
                                    <QRCodeSection entity={entity} />
                                    <SubscriptionActions entity={entity} />
                                </TabsContent>
                                <TabsContent value="nodes-usage">
                                    <UserNodesUsageWidget user={entity} />
                                </TabsContent>
                            </Tabs>
                        </ScrollArea>
                    ) : (
                        <div>Not Found</div>
                    )
                }
                Skeleton={<SettingsInfoSkeleton />}
                isFetching={isPending}
            />
        </SettingsDialog>
    );
};
