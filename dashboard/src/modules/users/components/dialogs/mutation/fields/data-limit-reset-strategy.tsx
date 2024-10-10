import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@marzneshin/components';
import { FC } from 'react'
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface DataLimitResetStrategyFieldProps { }

export const DataLimitResetStrategyField: FC<DataLimitResetStrategyFieldProps> = () => {
    const { t } = useTranslation()
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name="data_limit_reset_strategy"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{t('page.users.data_limit_reset_strategy')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Pick a date" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="no_reset">None</SelectItem>
                            <SelectItem value="day">Daily</SelectItem>
                            <SelectItem value="week">Weekly</SelectItem>
                            <SelectItem value="month">Monthly</SelectItem>
                            <SelectItem value="year">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
