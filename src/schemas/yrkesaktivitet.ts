import { z } from 'zod/v4'

import { dagoversiktSchema } from './dagoversikt'

export const yrkesaktivitetSchema = z.object({
    id: z.string(),
    kategorisering: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
    kategoriseringGenerert: z.record(z.string(), z.union([z.string(), z.array(z.string())])).nullable(),
    dagoversikt: dagoversiktSchema.nullable(),
    dagoversiktGenerert: dagoversiktSchema.nullable(),
    saksbehandlingsperiodeId: z.string(),
    opprettet: z.string(),
    generertFraDokumenter: z.array(z.string()),
    dekningsgrad: z.number(),
})

export type Yrkesaktivitet = z.infer<typeof yrkesaktivitetSchema>
