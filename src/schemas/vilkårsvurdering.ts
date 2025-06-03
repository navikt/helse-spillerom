import { z } from 'zod'

export type VilkårsvurderingSchema = z.infer<typeof vilkårsvurderingSchema>
export const vilkårsvurderingSchema = z.object({
    vilkårskode: z.string(),
    vurdering: z.string(),
    årsak: z.string(),
    notat: z.string(),
})
