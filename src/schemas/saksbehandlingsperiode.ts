import { z } from 'zod'

export const saksbehandlingsperiodeStatusSchema = z.enum(['UNDER_BEHANDLING', 'TIL_BESLUTNING', 'GODKJENT'])

export const saksbehandlingsperiodeSchema = z.object({
    id: z.string().uuid(),
    spilleromPersonId: z.string(),
    opprettet: z.string(), // ISO 8601 datetime string
    opprettetAvNavIdent: z.string(),
    opprettetAvNavn: z.string(),
    fom: z.string(), // ISO 8601 date string
    tom: z.string(), // ISO 8601 date string
    status: saksbehandlingsperiodeStatusSchema,
    beslutter: z.string().nullable().optional(),
})

export type Saksbehandlingsperiode = z.infer<typeof saksbehandlingsperiodeSchema>
export type SaksbehandlingsperiodeStatus = z.infer<typeof saksbehandlingsperiodeStatusSchema>
