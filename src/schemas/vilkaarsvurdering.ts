import { z } from 'zod/v4'

export const vurderingEnum = z.enum(['OPPFYLT', 'IKKE_OPPFYLT', 'IKKE_RELEVANT', 'SKAL_IKKE_VURDERES'])
export type Vurdering = z.infer<typeof vurderingEnum>

// Schema with structured årsaker
export const vilkaarsvurderingV2ArsakSchema = z.object({
    kode: z.string(),
    vurdering: z.string(),
})

export type VilkaarsvurderingV2Arsak = z.infer<typeof vilkaarsvurderingV2ArsakSchema>

export const vilkaarsvurderingV2Schema = z.object({
    kode: z.string(),
    vurdering: vurderingEnum,
    årsaker: z.array(vilkaarsvurderingV2ArsakSchema),
    notat: z.string().optional(),
})

export type VilkaarsvurderingV2 = z.infer<typeof vilkaarsvurderingV2Schema>
