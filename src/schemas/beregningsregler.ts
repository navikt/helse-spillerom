import { z } from 'zod/v4'

export const beregningsregelSchema = z.object({
    regelkode: z.string(),
    beskrivelse: z.string(),
    lovreferanse: z
        .object({
            lovverk: z.string(),
            paragraf: z.string(),
            ledd: z.string().optional(),
            setning: z.string().optional(),
            bokstav: z.string().optional(),
        })
        .optional(),
})

export const beregningsregelverkSchema = z.object({
    beregningsregler: z.array(beregningsregelSchema),
})

export type Beregningsregel = z.infer<typeof beregningsregelSchema>
export type Beregningsregelverk = z.infer<typeof beregningsregelverkSchema>
