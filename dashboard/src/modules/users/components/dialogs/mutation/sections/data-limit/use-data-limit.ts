import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export const useDataLimit = () => {
    const form = useFormContext();
    const dataLimit = form.watch("data_limit");

    const [isDataLimitEnabled, setIsDataLimitEnabled] = useState(dataLimit !== 0);

    useEffect(() => {
        setIsDataLimitEnabled(dataLimit !== 0);
    }, [dataLimit]);

    useEffect(() => {
        if (!isDataLimitEnabled) {
            form.setValue("data_limit", 0);
            form.setValue("data_limit_reset_strategy", "no_reset");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDataLimitEnabled]);

    return { isDataLimitEnabled, setIsDataLimitEnabled };
};
