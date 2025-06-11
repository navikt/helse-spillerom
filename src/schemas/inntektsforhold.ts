import { z } from 'zod'

export const inntektsforholdtypeSchema = z.enum([
    'ORDINÆRT_ARBEIDSFORHOLD',
    'FRILANSER',
    'SELVSTENDIG_NÆRINGSDRIVENDE',
    'ARBEIDSLEDIG',
])

export const inntektsforholdSchema = z.object({
    id: z.string(),
    inntektsforholdtype: inntektsforholdtypeSchema,
    sykmeldtFraForholdet: z.boolean(),
})

export type Inntektsforhold = z.infer<typeof inntektsforholdSchema>
export type Inntektsforholdtype = z.infer<typeof inntektsforholdtypeSchema>
