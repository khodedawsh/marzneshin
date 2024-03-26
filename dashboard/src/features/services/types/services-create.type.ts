import { z } from "zod";

export const ServiceCreateSchema = z.object({
    inbounds: z.array(z.number()),
    name: z.string().trim().min(1)
})

export type ServiceCreateType = z.infer<typeof ServiceCreateSchema>
