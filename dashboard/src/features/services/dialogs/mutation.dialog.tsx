

import {
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    FormItem,
    FormControl,
    FormMessage,
    FormLabel,
    Input,
    FormField,
    Button,
    Checkbox,
    Badge
} from '@marzneshin/components'
import { FC, useEffect } from 'react'
import {
    ServiceType,
    useServicesCreationMutation,
    useServicesUpdateMutation,
} from '@marzneshin/features/services'
import { useInboundsQuery } from '@marzneshin/features/inbounds'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { cn } from '@marzneshin/utils'
import { Box, GlobeLock } from 'lucide-react'

export const ServiceSchema = z.object({
    id: z.number().optional(),
    inbounds: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one inbound.",
    }),
    name: z.string().trim().min(1)
})
export type ServiceCreateType = z.infer<typeof ServiceSchema>

interface MutationDialogProps {
    service: ServiceType | ServiceCreateType | null
    open: boolean
    onOpenChange: (state: boolean) => void
}

const getDefaultValues = (): ServiceCreateType => ({
    name: '',
    inbounds: [],
})

export const MutationDialog: FC<MutationDialogProps> = ({ service, open, onOpenChange }) => {
    const isEditing = service !== null
    const updateMutation = useServicesUpdateMutation();
    const createMutation = useServicesCreationMutation();
    const { data: inbounds } = useInboundsQuery()
    const form = useForm({
        defaultValues: isEditing ? service : getDefaultValues(),
        resolver: zodResolver(ServiceSchema)
    })
    const { t } = useTranslation();

    const submit = (values: ServiceCreateType | ServiceType) => {
        if (isEditing) {
            updateMutation.mutate(values as ServiceType)
        } else {
            createMutation.mutate(values)
        }
        onOpenChange(false);
    }

    useEffect(() => {
        if (isEditing)
            form.reset(service);
        else
            form.reset(getDefaultValues())
    }, [service, form, isEditing])

    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-primary">
                        {isEditing ?
                            t('page.services.dialogs.edition.title') :
                            t('page.services.dialogs.creation.title')}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(submit)} >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('name')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="inbounds"
                            render={() => (
                                <FormItem>
                                    <FormLabel>{t('inbounds')}</FormLabel>
                                    {inbounds.map((inbound) => (
                                        <FormField
                                            key={inbound.id}
                                            control={form.control}
                                            name="inbounds"
                                            render={({ field }) => (
                                                <FormItem key={inbound.id} >
                                                    <FormControl>
                                                        <div
                                                            className={cn("flex flex-row items-center p-3 space-y-0 space-x-3 rounded-md border", { "bg-secondary": field.value?.includes(inbound.id) })}>
                                                            <Checkbox
                                                                checked={field.value?.includes(inbound.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, inbound.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== inbound.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                            <FormLabel className="flex flex-row justify-between items-center w-full">
                                                                {inbound.tag}
                                                                <div className="flex gap-2">
                                                                    <Badge className="py-1 px-2"> <GlobeLock className="mr-1 w-4" /> {inbound.protocol} </Badge>
                                                                    <Badge className="py-1 px-2"> <Box className="mr-1 w-4" /> {inbound.node.name} </Badge>
                                                                </div>
                                                            </FormLabel>
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="mt-3 w-full font-semibold"
                            type="submit"
                            disabled={form.formState.isSubmitting}>
                            {t('submit')}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
