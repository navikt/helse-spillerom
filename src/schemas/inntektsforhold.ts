import { z } from 'zod'

export const inntektsforholdSchema = z
    .object({
        id: z.string(),
        svar: z.record(z.string(), z.string()),
        sykmeldtFraForholdet: z.boolean(),
        orgnummer: z.string().optional(),
        orgnavn: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        // Check if it's an ordinary work relationship and requires organization number
        if (
            data.svar['INNTEKTSKATEGORI'] === 'ARBEIDSTAKER' &&
            data.svar['TYPE_ARBEIDSTAKER'] === 'ORDINÆRT_ARBEIDSFORHOLD' &&
            data.orgnummer?.length !== 9
        ) {
            ctx.addIssue({
                path: ['orgnummer'],
                code: z.ZodIssueCode.custom,
                message: 'Organisasjonsnummer må fylles inn (9 siffer)',
            })
        }
    })

export type Inntektsforhold = z.infer<typeof inntektsforholdSchema>
