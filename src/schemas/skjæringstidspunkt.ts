import { z } from 'zod/v4'

export type SkjæringstidspunktSchema = z.infer<typeof skjæringstidspunktSchema>
export const skjæringstidspunktSchema = z.object({
    skjæringstidspunkt: z.iso.date({ error: 'Ugyldig format' }), // ISO 8601 date string
    saksbehandlingsperiodeId: z.string(),
})
