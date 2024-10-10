import type { UserType } from "@marzneshin/modules/users";
import QRCode from "react-qr-code";
import { QrCodeIcon } from "lucide-react";
import type { FC } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import { getSubscriptionLink } from "@marzneshin/utils";

export interface QRCodeProps {
    entity: UserType;
}

export const QRCodeSection: FC<QRCodeProps> = ({ entity }) => {
    const subscribeQrLink = getSubscriptionLink(entity.subscription_url);
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center w-full">
                <CardTitle className="flex flex-row gap-4 justify-start">
                    <QrCodeIcon />
                    {t("subscription")} QRCode
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center py-10 w-full h-full">
                <QRCode size={150} className="size-2/3" value={subscribeQrLink} />
            </CardContent>
        </Card>
    );
};
