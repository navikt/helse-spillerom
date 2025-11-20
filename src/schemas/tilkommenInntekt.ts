import { z } from 'zod/v4'
import dayjs from 'dayjs'

export const tilkommenInntektYrkesaktivitetTypeSchema = z.enum(['VIRKSOMHET', 'PRIVATPERSON', 'NÆRINGSDRIVENDE'])

export type TilkommenInntektYrkesaktivitetType = z.infer<typeof tilkommenInntektYrkesaktivitetTypeSchema>

export const opprettTilkommenInntektRequestSchema = z
    .object({
        ident: z.string().regex(/^\d{9}$/, { message: 'Organisasjonsnummer må være 9 siffer' }),
        yrkesaktivitetType: tilkommenInntektYrkesaktivitetTypeSchema,
        fom: z.iso.date({ error: 'Fra og med dato må være fylt ut og være en gyldig dato' }),
        tom: z.iso.date({ error: 'Til og med dato må være fylt ut og være en gyldig dato' }),
        inntektForPerioden: z.number({ error: 'Inntekt for perioden må være et tall' }).min(0),
        notatTilBeslutter: z.string(),
        ekskluderteDager: z.array(z.iso.date()).default([]),
    })
    .superRefine(({ fom, tom }, ctx) => {
        const fomDate = dayjs(fom)
        const tomDate = dayjs(tom)

        if (fomDate.isValid() && tomDate.isValid() && tomDate.isSameOrBefore(fomDate)) {
            ctx.addIssue({
                code: 'custom',
                path: ['tom'],
                message: 'Til-dato må være etter fra-dato',
            })
        }
    })

export type OpprettTilkommenInntektRequest = z.infer<typeof opprettTilkommenInntektRequestSchema>

export const tilkommenInntektResponseSchema = z.object({
    id: z.string().uuid(),
    ident: z.string(),
    yrkesaktivitetType: tilkommenInntektYrkesaktivitetTypeSchema,
    fom: z.iso.date(),
    tom: z.iso.date(),
    inntektForPerioden: z.number(),
    notatTilBeslutter: z.string(),
    ekskluderteDager: z.array(z.iso.date()),
    opprettet: z.string(), // OffsetDateTime som string
    opprettetAvNavIdent: z.string(),
})

export type TilkommenInntektResponse = z.infer<typeof tilkommenInntektResponseSchema>
