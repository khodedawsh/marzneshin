import {
    FormControl,
    FormField,
    FormItem,
    Textarea,
    FormLabel,
    FormMessage,
} from "@marzneshin/components";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface NoteFieldProps { }

export const NoteField: FC<NoteFieldProps> = () => {
    const { t } = useTranslation();
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("note")}</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={t("page.users.note-placeholder")}
                            className="resize-none"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
