import { z } from 'zod'

export const inntektsforholdtypeSchema = z.enum([
    'ORDINÆRT_ARBEIDSFORHOLD',
    'FRILANSER',
    'SELVSTENDIG_NÆRINGSDRIVENDE',
    'ARBEIDSLEDIG',
])

export const inntektsforholdSchema = z
    .object({
        id: z.string(),
        inntektsforholdtype: inntektsforholdtypeSchema,
        sykmeldtFraForholdet: z.boolean(),
        orgnummer: z.string().optional(),
        orgnavn: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.inntektsforholdtype === 'ORDINÆRT_ARBEIDSFORHOLD' && data.orgnummer?.length !== 9) {
            ctx.addIssue({
                path: ['orgnummer'],
                code: z.ZodIssueCode.custom,
                message: 'Organisasjonsnummer må fylles inn (9 siffer)',
            })
        }
    })

export type Inntektsforhold = z.infer<typeof inntektsforholdSchema>
export type Inntektsforholdtype = z.infer<typeof inntektsforholdtypeSchema>
