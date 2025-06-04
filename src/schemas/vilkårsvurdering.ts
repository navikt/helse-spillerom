import { z } from 'zod'

export type VilkårsvurderingSchema = z.infer<typeof vilkårsvurderingSchema>
export const vilkårsvurderingSchema = z
    .object({
        vilkårskode: z.string(),
        vurdering: z.string().min(1, 'Du må vurdere vilkåret'),
        årsak: z.string().optional(),
        notat: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.vurdering !== 'SKAL_IKKE_VURDERES' && data.årsak === '') {
            ctx.addIssue({
                path: ['årsak'],
                code: z.ZodIssueCode.custom,
                message: 'Du må velge en begrunnelse',
            })
        }
    })
