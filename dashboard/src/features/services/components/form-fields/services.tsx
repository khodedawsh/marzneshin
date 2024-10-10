import {
    Alert,
    AlertDescription,
    AlertTitle,
    Checkbox,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    ScrollArea,
    Skeleton,
    Awaiting
} from "@marzneshin/components";
import { Link } from "@tanstack/react-router";
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import {
    useServicesQuery,
    type ServiceType,
} from "@marzneshin/features/services";
import { ServiceCard } from "@marzneshin/modules/users";
import { cn } from "@marzneshin/utils";
import type { FC } from "react";
import {
    useFormContext,
    type FieldValues,
    type ControllerRenderProps,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ServiceCheckboxCardProps {
    service: ServiceType;
    field: ControllerRenderProps<FieldValues, "service_ids">;
}

const ServiceCheckboxCard: FC<ServiceCheckboxCardProps> = ({
    service,
    field,
}) => (
    <div
        className={cn(
            "flex mb-2 flex-row gap-2 items-center p-3 rounded-md border",
            { "bg-secondary": field.value?.includes(service.id) },
        )}
    >
        <Checkbox
            checked={field.value?.includes(service.id)}
            onCheckedChange={(checked) =>
                checked
                    ? field.onChange([...field.value, service.id])
                    : field.onChange(
                        field.value?.filter((value: number) => value !== service.id),
                    )
            }
        />
        <FormLabel className="flex flex-row justify-between items-center w-full">
            <ServiceCard service={service} />
        </FormLabel>
    </div>
);

const ServiceSkeletons: FC = () => (
    <>
        <Skeleton className="w-full h-[2.4rem]" />
        <Skeleton className="w-full h-[2.4rem]" />
        <Skeleton className="w-full h-[2.4rem]" />
    </>
);

const ServicesList: FC<{ services: ServiceType[] }> = ({ services }) => {
    const form = useFormContext();

    return (
        <ScrollArea className="flex flex-col justify-start px-1 h-full max-h-[20rem]">
            {services.map((service) => (
                <FormField
                    key={service.id}
                    control={form.control}
                    name="service_ids"
                    render={({ field }) => (
                        <FormItem key={service.id}>
                            <FormControl>
                                <ServiceCheckboxCard service={service} field={field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ))}
        </ScrollArea>
    );
};

const ServicesAlert: FC = () => {
    const { t } = useTranslation();

    return (
        <Alert className="ring-1 ring-destructive-accent">
            <ExclamationTriangleIcon color="#E5484D" className="mr-2 text-destructive-accent" />
            <AlertTitle className="font-semibold text-destructive">{t('page.users.services-alert.title')}</AlertTitle>
            <AlertDescription>
                {t('page.users.services-alert.desc')}
                <Link className="m-1 font-semibold text-secondary-foreground" to="/services">
                    {t('page.users.services-alert.click')}
                </Link>
            </AlertDescription>
        </Alert>
    );
};

export const ServicesField: FC = () => {
    const form = useFormContext();
    const { data, isFetching } = useServicesQuery({ page: 1, size: 100 });
    const { t } = useTranslation();

    return (
        <FormField
            control={form.control}
            name="service_ids"
            render={() => (
                <FormItem>
                    <FormLabel>{t("services")}</FormLabel>
                    <Awaiting
                        isFetching={isFetching}
                        Skeleton={<ServiceSkeletons />}
                        isNotFound={data.entities.length === 0}
                        NotFound={<ServicesAlert />}
                        Component={<ServicesList services={data.entities} />}
                    />
                </FormItem>
            )}
        />
    );
};
