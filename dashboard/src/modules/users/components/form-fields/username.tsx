import {
    FormControl,
    FormField,
    FormItem,
    Input,
    FormLabel,
    FormMessage,
} from "@marzneshin/components";
import type { FC, InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const UsernameField: FC<InputHTMLAttributes<HTMLElement>> = ({
    disabled,
}) => {
    const form = useFormContext();
    const { t } = useTranslation();

    return (
        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("username")}</FormLabel>
                    <FormControl>
                        <Input disabled={disabled} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
