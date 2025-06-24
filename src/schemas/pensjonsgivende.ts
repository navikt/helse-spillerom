import { z } from 'zod'

export const pensjonsgivendeInntektSchema = z.any()
export type PensjonsgivendeInntekt = z.infer<typeof pensjonsgivendeInntektSchema>
