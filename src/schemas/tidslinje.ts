import { z } from 'zod/v4'

import { saksbehandlingsperiodeStatusSchema } from './saksbehandlingsperiode'

const behandlingTidslinjeElementSchema = z.object({
    fom: z.iso.date(),
    tom: z.iso.date(),
    skjæringstidspunkt: z.iso.date(),
    behandlingId: z.string(),
    status: saksbehandlingsperiodeStatusSchema,
})

const yrkesaktivitetTidslinjeElementSchema = behandlingTidslinjeElementSchema.extend({
    yrkesaktivitetId: z.string(),
    ghost: z.boolean(),
})

const tilkommenInntektTidslinjeElementSchema = behandlingTidslinjeElementSchema.extend({
    tilkommenInntektId: z.string(),
})

const opprettetBehandlingSchema = z.object({
    tidslinjeRadType: z.literal('OpprettetBehandling'),
    id: z.literal('OPPRETTET_BEHANDLING'),
    navn: z.literal('Opprettet behandling'),
    tidslinjeElementer: z.array(behandlingTidslinjeElementSchema),
})

const sykmeldtYrkesaktivitetSchema = z.object({
    tidslinjeRadType: z.literal('SykmeldtYrkesaktivitet'),
    id: z.string(),
    navn: z.string(),
    tidslinjeElementer: z.array(yrkesaktivitetTidslinjeElementSchema),
})

const tilkommenInntektSchema = z.object({
    tidslinjeRadType: z.literal('TilkommenInntekt'),
    id: z.string(),
    navn: z.string(),
    tidslinjeElementer: z.array(tilkommenInntektTidslinjeElementSchema),
})

const tidslinjeRadSchema = z.discriminatedUnion('tidslinjeRadType', [
    opprettetBehandlingSchema,
    sykmeldtYrkesaktivitetSchema,
    tilkommenInntektSchema,
])

export const tidslinjeSchema = z.object({
    rader: z.array(tidslinjeRadSchema),
})

export type Tidslinje = z.infer<typeof tidslinjeSchema>
export type TidslinjeRad = z.infer<typeof tidslinjeRadSchema>
export type OpprettetBehandling = z.infer<typeof opprettetBehandlingSchema>
export type SykmeldtYrkesaktivitet = z.infer<typeof sykmeldtYrkesaktivitetSchema>
export type TilkommenInntekt = z.infer<typeof tilkommenInntektSchema>
export type BehandlingTidslinjeElement = z.infer<typeof behandlingTidslinjeElementSchema>
export type YrkesaktivitetTidslinjeElement = z.infer<typeof yrkesaktivitetTidslinjeElementSchema>
export type TilkommenInntektTidslinjeElement = z.infer<typeof tilkommenInntektTidslinjeElementSchema>
