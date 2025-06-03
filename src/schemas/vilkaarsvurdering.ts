import { z } from 'zod'

export const vurderingEnum = z.enum(['JA', 'NEI', 'IKKE_AKTUELT'])
export type Vurdering = z.infer<typeof vurderingEnum>

export const vilkaarsvurderingSchema = z.object({
    kode: z.string(),
    vurdering: vurderingEnum,
    begrunnelse: z.string(),
    notat: z.string().optional(),
})

export type Vilkaarsvurdering = z.infer<typeof vilkaarsvurderingSchema>
