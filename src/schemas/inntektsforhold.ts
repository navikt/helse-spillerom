import { z } from 'zod/v4'

import { dagoversiktSchema } from './dagoversikt'

export const inntektsforholdSchema = z.object({
    id: z.string(),
    kategorisering: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
    dagoversikt: dagoversiktSchema.nullable(),
    generertFraDokumenter: z.array(z.string()),
})

export type Inntektsforhold = z.infer<typeof inntektsforholdSchema>
