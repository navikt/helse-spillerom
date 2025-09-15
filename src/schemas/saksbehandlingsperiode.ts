import { z } from 'zod/v4'

export const saksbehandlingsperiodeStatusSchema = z.enum([
    'UNDER_BEHANDLING',
    'TIL_BESLUTNING',
    'UNDER_BESLUTNING',
    'GODKJENT',
])

export const saksbehandlingsperiodeEndringTypeSchema = z.enum([
    'STARTET',
    'SENDT_TIL_BESLUTNING',
    'TATT_TIL_BESLUTNING',
    'SENDT_I_RETUR',
    'GODKJENT',
])

export const saksbehandlingsperiodeEndringSchema = z.object({
    saksbehandlingsperiodeId: z.uuid(),
    status: saksbehandlingsperiodeStatusSchema,
    beslutterNavIdent: z.string().nullable(),
    endretTidspunkt: z.string(), // ISO 8601 datetime string
    endretAvNavIdent: z.string(),
    endringType: saksbehandlingsperiodeEndringTypeSchema,
    endringKommentar: z.string().nullable().optional(),
})

export const saksbehandlingsperiodeSchema = z.object({
    id: z.uuid(),
    spilleromPersonId: z.string(),
    opprettet: z.string(), // ISO 8601 datetime string
    opprettetAvNavIdent: z.string(),
    opprettetAvNavn: z.string(),
    fom: z.string(), // ISO 8601 date string
    tom: z.string(), // ISO 8601 date string
    status: saksbehandlingsperiodeStatusSchema,
    beslutter: z.string().optional(),
    skjæringstidspunkt: z.string().optional(), // ISO 8601 date string
    individuellBegrunnelse: z.string().optional(),
})

export const oppdaterBegrunnelseSchema = z.object({
    individuellBegrunnelse: z.string().optional(),
})

export const oppdaterSkjæringstidspunktSchema = z.object({
    skjaeringstidspunkt: z.string().optional(), // ISO 8601 date string
})

export type Saksbehandlingsperiode = z.infer<typeof saksbehandlingsperiodeSchema>
export type SaksbehandlingsperiodeStatus = z.infer<typeof saksbehandlingsperiodeStatusSchema>
export type SaksbehandlingsperiodeEndring = z.infer<typeof saksbehandlingsperiodeEndringSchema>
export type SaksbehandlingsperiodeEndringType = z.infer<typeof saksbehandlingsperiodeEndringTypeSchema>
export type OppdaterBegrunnelse = z.infer<typeof oppdaterBegrunnelseSchema>
export type OppdaterSkjæringstidspunkt = z.infer<typeof oppdaterSkjæringstidspunktSchema>
