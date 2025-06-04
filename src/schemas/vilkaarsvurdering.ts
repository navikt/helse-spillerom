import { z } from 'zod'

export const vurderingEnum = z.enum(['OPPFYLT', 'IKKE_OPPFYLT', 'IKKE_RELEVANT', 'SKAL_IKKE_VURDERES'])
export type Vurdering = z.infer<typeof vurderingEnum>

export const vilkaarsvurderingSchema = z.object({
    kode: z.string(),
    vurdering: vurderingEnum,
    årsak: z.string(),
    notat: z.string().optional(),
})

export type Vilkaarsvurdering = z.infer<typeof vilkaarsvurderingSchema>
