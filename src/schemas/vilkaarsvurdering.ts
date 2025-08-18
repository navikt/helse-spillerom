import { z } from 'zod/v4'

export const vurderingEnum = z.enum(['OPPFYLT', 'IKKE_OPPFYLT', 'IKKE_RELEVANT', 'SKAL_IKKE_VURDERES'])
export type Vurdering = z.infer<typeof vurderingEnum>

// Schema with structured underspørsmål
export const vilkaarsvurderingV2UnderspørsmålSchema = z.object({
    spørsmål: z.string(),
    svar: z.string(),
})

export type VilkaarsvurderingUnderspørsmål = z.infer<typeof vilkaarsvurderingV2UnderspørsmålSchema>

export const vilkaarsvurderingSchema = z.object({
    hovedspørsmål: z.string(),
    vurdering: vurderingEnum,
    underspørsmål: z.array(vilkaarsvurderingV2UnderspørsmålSchema),
    notat: z.string().optional(),
})

export type Vilkaarsvurdering = z.infer<typeof vilkaarsvurderingSchema>
