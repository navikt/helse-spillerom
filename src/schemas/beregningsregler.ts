import { z } from 'zod/v4'

import { vilkårshjemmelSchema } from '@schemas/kodeverkV2'

export const beregningsregelSchema = z.object({
    kode: z.string(),
    beskrivelse: z.string(),
    vilkårshjemmel: vilkårshjemmelSchema.optional(),
    sistEndretAv: z.string().optional(),
    sistEndretDato: z.string().optional(),
})

export const beregningsreglerArraySchema = z.array(beregningsregelSchema)
export type BeregningsreglerArray = z.infer<typeof beregningsreglerArraySchema>
