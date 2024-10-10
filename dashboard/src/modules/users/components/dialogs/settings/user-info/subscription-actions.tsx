import { Button, HStack } from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import { getSubscriptionLink } from "@marzneshin/utils";
import { useUserSubscriptionRevokeCmd } from "@marzneshin/modules/users";
import { CopyToClipboardButton } from "@marzneshin/components";
import { SquareCode } from "lucide-react";
import type { QRCodeProps } from "./qrcode";
import type { FC } from 'react';

export const SubscriptionActions: FC<QRCodeProps> = ({ entity }) => {
    const subscribeQrLink = getSubscriptionLink(entity.subscription_url);
    const { mutate: revokeSubscription } = useUserSubscriptionRevokeCmd();
    const { t } = useTranslation();
    return (
        <HStack className="w-full items-center my-2">
            <CopyToClipboardButton
                text={subscribeQrLink}
                successMessage={t("page.users.settings.subscription_link.copied")}
                copyLabel={t("page.users.settings.subscription_link.copy")}
                errorLabel={t("page.users.settings.subscription_link.error")}
                copyIcon={SquareCode}
                className="w-1/2"
            />
            <Button variant="destructive" className="w-1/2" onClick={() => revokeSubscription(entity)}>
                {t("page.users.revoke_subscription")}
            </Button>
        </HStack>
    );
};
