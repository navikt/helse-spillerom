import { z } from 'zod/v4'

const pensjonsgivendeInntektItemSchema = z.object({
    skatteordning: z.string(),
    datoForFastsetting: z.string(),
    pensjonsgivendeInntektAvLoennsinntekt: z.string().nullable(),
    pensjonsgivendeInntektAvLoennsinntektBarePensjonsdel: z.string().nullable(),
    pensjonsgivendeInntektAvNaeringsinntekt: z.string().nullable(),
    pensjonsgivendeInntektAvNaeringsinntektFraFiskeFangstEllerFamiliebarnehage: z.string().nullable(),
})

const pensjonsgivendeInntektÅrSchema = z.object({
    norskPersonidentifikator: z.string(),
    inntektsaar: z.number(),
    pensjonsgivendeInntekt: z.array(pensjonsgivendeInntektItemSchema).nullable(),
})

export const pensjonsgivendeInntektSchema = z.array(pensjonsgivendeInntektÅrSchema)
export type PensjonsgivendeInntekt = z.infer<typeof pensjonsgivendeInntektSchema>
export type PensjonsgivendeInntektÅr = z.infer<typeof pensjonsgivendeInntektÅrSchema>
export type PensjonsgivendeInntektItem = z.infer<typeof pensjonsgivendeInntektItemSchema>
