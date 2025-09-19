import { z } from 'zod/v4'

export const beregningsregelSchema = z.object({
    kode: z.string(),
    beskrivelse: z.string(),
    vilkårshjemmel: z
        .object({
            lovverk: z.string(),
            paragraf: z.string(),
            ledd: z.string().optional(),
            setning: z.string().optional(),
            bokstav: z.string().optional(),
        })
        .optional(),
})

export const beregningsreglerArraySchema = z.array(beregningsregelSchema)
export type BeregningsreglerArray = z.infer<typeof beregningsreglerArraySchema>
