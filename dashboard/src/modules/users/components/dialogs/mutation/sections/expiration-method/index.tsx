import { FC } from "react";
import {
    Tabs,
    TabsTrigger,
    TabsContent,
    FormLabel
} from '@marzneshin/components';
import type {
    UserMutationType,
} from "@marzneshin/modules/users";
import {
    ExpireDateField,
    ActivationDeadlineField,
    UsageDurationField,
} from "@marzneshin/modules/users/components/dialogs/mutation/fields";
import { TabsList } from "@radix-ui/react-tabs";
import { useTranslation } from "react-i18next";
import { useExpirationMethodTabs } from "./use-expiration-method-tabs";

interface ExpirationMethodProps {
    entity: UserMutationType | null
}

export const ExpirationMethodFields: FC<ExpirationMethodProps> = ({ entity }) => {
    const { t } = useTranslation();
    const {
        handleTabChange,
        selectedExpirationMethodTab
    } = useExpirationMethodTabs(entity);

    return (
        <>
            <FormLabel className="text-md">
                {t('page.users.expire_method')}
            </FormLabel>
            <Tabs
                defaultValue={selectedExpirationMethodTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <TabsList className="flex flex-row items-center p-1 w-full rounded-md bg-accent">
                    <TabsTrigger
                        className="w-full"
                        value="fixed_date">
                        {t('page.users.fixed_date')}
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-full"
                        value="start_on_first_use">
                        {t('page.users.on_first_use')}
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-full"
                        value="never">
                        {t('page.users.never')}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="fixed_date">
                    <ExpireDateField />
                </TabsContent>
                <TabsContent value="start_on_first_use">
                    <UsageDurationField />
                    <ActivationDeadlineField />
                </TabsContent>
            </Tabs>
        </>
    );
};
