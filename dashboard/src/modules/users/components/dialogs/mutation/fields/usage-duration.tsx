import {
    FormControl,
    FormField,
    FormItem,
    Input,
    FormLabel,
    FormMessage
} from '@marzneshin/components';
import { type FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const UsageDurationField: FC = () => {
    const form = useFormContext();
    const { t } = useTranslation();

    const defaultDuration = (form.getValues('usage_duration') ?? 0) / 86400;
    const [duration, setDuration] = useState<number>(defaultDuration);

    useEffect(() => {
        form.setValue('usage_duration', duration * 86400);
    }, [form, duration]);

    return (
        <FormField
            control={form.control}
            name="usage_duration"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('page.users.usage_duration')} ({t('days')})</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            type="number"
                            value={duration}
                            onChange={(e) => {
                                setDuration(Number(e.target.value));
                                field.onChange(e.target.value);
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
