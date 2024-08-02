import {
    type SettingsDialogProps,
    SettingsDialog,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@marzneshin/components";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { NodeBackendType, NodeType } from "../..";
import { NodesDetailTable } from "../../tables/detail-table";
import { NodeBackendSetting } from "./node-backend-setting";

interface NodesSettingsDialogProps extends SettingsDialogProps {
    entity: NodeType;
    onClose: () => void;
}

export const NodesSettingsDialog: FC<NodesSettingsDialogProps> = ({
    onOpenChange,
    open,
    entity,
    onClose,
}) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (!open) onClose();
    }, [open, onClose]);

    return (
        <SettingsDialog open={open} onOpenChange={onOpenChange}>
            <div className="my-4">
                <h1 className="font-medium font-header">
                    {t("page.nodes.settings.detail")}
                </h1>
                <NodesDetailTable node={entity} />
            </div>
            <Tabs>
                <TabsList>
                    {...entity.backends.map((backend: NodeBackendType) => (
                        <TabsTrigger
                            className="w-full"
                            value={backend.name}
                            key={backend.name}
                        >
                            {backend.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {...entity.backends.map((backend: NodeBackendType) => (
                    <TabsContent
                        className="w-full"
                        value={backend.name}
                        key={backend.name}
                    >
                        <NodeBackendSetting node={entity} backend={backend.name} />
                    </TabsContent>
                ))}
            </Tabs>
        </SettingsDialog>
    );
};
