import { z } from 'zod/v4'

export const behandlingStatusSchema = z.enum([
    'UNDER_BEHANDLING',
    'TIL_BESLUTNING',
    'UNDER_BESLUTNING',
    'GODKJENT',
    'REVURDERT',
])

export const behandlingEndringTypeSchema = z.enum([
    'STARTET',
    'SENDT_TIL_BESLUTNING',
    'TATT_TIL_BESLUTNING',
    'SENDT_I_RETUR',
    'GODKJENT',
    'OPPDATERT_INDIVIDUELL_BEGRUNNELSE',
    'OPPDATERT_SKJÆRINGSTIDSPUNKT',
    'OPPDATERT_YRKESAKTIVITET_KATEGORISERING',
    'REVURDERING_STARTET',
])

export const behandlingEndringSchema = z.object({
    saksbehandlingsperiodeId: z.uuid(),
    status: behandlingStatusSchema,
    beslutterNavIdent: z.string().nullable(),
    endretTidspunkt: z.string(), // ISO 8601 datetime string
    endretAvNavIdent: z.string(),
    endringType: behandlingEndringTypeSchema,
    endringKommentar: z.string().nullable().optional(),
})

export const behandlingSchema = z.object({
    id: z.uuid(),
    naturligIdent: z.string(),
    opprettet: z.string(), // ISO 8601 datetime string
    opprettetAvNavIdent: z.string(),
    opprettetAvNavn: z.string(),
    fom: z.string(), // ISO 8601 date string
    tom: z.string(), // ISO 8601 date string
    status: behandlingStatusSchema,
    beslutterNavIdent: z.string().optional(),
    skjæringstidspunkt: z.string().optional(), // ISO 8601 date string
    individuellBegrunnelse: z.string().optional(),
    revurdererSaksbehandlingsperiodeId: z.uuid().nullable().optional(),
})

export const oppdaterSkjæringstidspunktSchema = z.object({
    skjaeringstidspunkt: z.string().optional(), // ISO 8601 date string
})

export type Behandling = z.infer<typeof behandlingSchema>
export type BehandlingStatus = z.infer<typeof behandlingStatusSchema>
export type BehandlingEndring = z.infer<typeof behandlingEndringSchema>
export type OppdaterSkjæringstidspunkt = z.infer<typeof oppdaterSkjæringstidspunktSchema>
