import {
    FormControl,
    FormField,
    FormItem,
    Input,
    FormLabel,
    FormMessage
} from '@marzneshin/components';
import { FC } from 'react'
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface DataLimitFieldProps { }

export const DataLimitField: FC<DataLimitFieldProps> = () => {
    const { t } = useTranslation()
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name="data_limit"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{t('page.users.traffic')}</FormLabel>
                    <FormControl>
                        <Input
                            type="number"
                            className="order-1"
                            {...field}
                            placeholder="GB"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
