import { z } from 'zod/v4'

const inntektSchema = z.object({
    type: z.string(),
    beloep: z.number(),
    fordel: z.string(),
    beskrivelse: z.string(),
    inngaarIGrunnlagForTrekk: z.boolean(),
    utloeserArbeidsgiveravgift: z.boolean(),
})

const maanedSchema = z.object({
    maaned: z.string(),
    opplysningspliktig: z.string(),
    underenhet: z.string(),
    norskident: z.string(),
    oppsummeringstidspunkt: z.string(),
    inntektListe: z.array(inntektSchema),
    forskuddstrekkListe: z.array(z.unknown()),
    avvikListe: z.array(z.unknown()),
})

export const ainntektSchema = z.object({
    data: z.array(maanedSchema),
})

export type Ainntekt = z.infer<typeof ainntektSchema>
