import { FC } from "react";
import { FormLabel, Switch } from '@marzneshin/components';
import { useTranslation } from 'react-i18next';
import { DataLimitField, DataLimitResetStrategyField } from "../../fields";
import { useFormContext } from "react-hook-form";
import { useDataLimit } from "./use-data-limit";

export const DataLimitFields: FC = () => {
    const { t } = useTranslation();
    const { isDataLimitEnabled, setIsDataLimitEnabled } = useDataLimit();
    const form = useFormContext();

    const handleToggleChange = () => {
        setIsDataLimitEnabled(!isDataLimitEnabled);
    };

    return (
        <div className="my-2">
            <FormLabel className="hstack justify-between items-center text-md my-2" >
                {t('page.users.data_limit_method')}
                <Switch checked={isDataLimitEnabled} onCheckedChange={handleToggleChange} />
            </FormLabel>
            <div className="flex gap-2 items-center w-full sm:flex-row md:flex-col">
                {isDataLimitEnabled && (
                    <div className="flex gap-2 items-center w-full">
                        <DataLimitField />
                        {form.watch().data_limit !== 0 && <DataLimitResetStrategyField />}
                    </div>
                )}
            </div>
        </div>
    );
};
