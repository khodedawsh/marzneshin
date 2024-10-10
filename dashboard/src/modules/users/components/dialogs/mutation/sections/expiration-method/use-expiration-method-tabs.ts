import { UserMutationType, ExpireStrategy } from "@marzneshin/modules/users";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { strategies } from "./expiration-method.strategy"


export const useExpirationMethodTabs = (entity: UserMutationType | null) => {
    const form = useFormContext();

    const [
        selectedExpirationMethodTab,
        setSelectedExpirationMethodTab
    ] = useState<ExpireStrategy>(entity ? entity.expire_strategy : 'fixed_date');
    useEffect(() => {
        strategies[selectedExpirationMethodTab as ExpireStrategy].apply(form);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedExpirationMethodTab]);

    const handleTabChange = (value: string) => {
        setSelectedExpirationMethodTab(value as ExpireStrategy);
    };

    return {
        selectedExpirationMethodTab,
        setSelectedExpirationMethodTab,
        handleTabChange,
    };
};
