import { z } from 'zod';
import { DATA_LIMIT_METRIC } from '@marzneshin/modules/users';

export const UserSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    note: z.string().nullable(),
    data_limit: z
        .union([z.string().transform((str) => (Number(str))), z.number()])
        .refine(val => val >= 0, { message: 'The minimum number is 0' })
        .transform((val) => (Math.round(val) ?? 0) * DATA_LIMIT_METRIC)
        .nullable()
        .optional(),
    data_limit_reset_strategy: z
        .enum(["no_reset", "day", "week", "month", "year"])
        .or(z.number())
        .or(z.string())
        .nullable().optional(),
    expire_strategy: z.enum(["never", "fixed_date", "start_on_first_use"]),
    usage_duration: z.number().nullable().optional(),
    activation_deadline: z
        .string()
        .or(z.date())
        .nullable()
        .optional(),
    expire_date: z
        .string()
        .or(z.date())
        .nullable()
        .optional(),
    service_ids: z
        .array(z.number().or(z.string()))
        .nonempty({ message: 'At least one service is required' })
        .transform((v) => v.map(Number)),
});

export type UserMutationType = z.infer<typeof UserSchema>;
