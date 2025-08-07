import { z } from 'zod/v4'

export type VilkårsvurderingSchema = z.infer<typeof vilkårsvurderingSchema>
export const vilkårsvurderingSchema = z.object({
    vilkårskode: z.string(),
    vurdering: z.string().min(1, 'Du må vurdere vilkåret'),
    årsak: z.string().optional(),
    notat: z.string(),
})
