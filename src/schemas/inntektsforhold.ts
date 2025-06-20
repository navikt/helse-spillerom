import { z } from 'zod'

import { dagoversiktSchema } from './dagoversikt'

export const inntektsforholdSchema = z.object({
    id: z.string(),
    kategorisering: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
    sykmeldtFraForholdet: z.boolean(),
    dagoversikt: dagoversiktSchema,
    generertFraDokumenter: z.array(z.string()),
})

export type Inntektsforhold = z.infer<typeof inntektsforholdSchema>
