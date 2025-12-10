import { z } from 'zod/v4'

import { behandlingStatusSchema } from './behandling'

const yrkesaktivitetTypeSchema = z.enum([
    'ARBEIDSTAKER',
    'FRILANSER',
    'SELVSTENDIG_NÆRINGSDRIVENDE',
    'INAKTIV',
    'ARBEIDSLEDIG',
])

const tilkommenInntektYrkesaktivitetTypeSchema = z.enum(['VIRKSOMHET', 'PRIVATPERSON', 'NÆRINGSDRIVENDE'])

const tidslinjeYrkesaktivitetSchema = z.object({
    id: z.string(),
    sykmeldt: z.boolean(),
    orgnummer: z.string().nullable(),
    orgnavn: z.string().nullable(),
    yrkesaktivitetType: yrkesaktivitetTypeSchema,
})

const tidslinjeTilkommenInntektSchema = z.object({
    id: z.string(),
    orgnavn: z.string().nullable(),
    ident: z.string(),
    yrkesaktivitetType: tilkommenInntektYrkesaktivitetTypeSchema,
    fom: z.iso.date(),
    tom: z.iso.date(),
})

export const tidslinjeBehandlingSchema = z.object({
    id: z.string(),
    status: behandlingStatusSchema,
    fom: z.iso.date(),
    tom: z.iso.date(),
    skjæringstidspunkt: z.iso.date().optional().nullable(),
    revurdertAvBehandlingId: z.string().nullable(),
    revurdererBehandlingId: z.string().nullable(),
    yrkesaktiviteter: z.array(tidslinjeYrkesaktivitetSchema),
    tilkommenInntekt: z.array(tidslinjeTilkommenInntektSchema),
})

export const tidslinjeBehandlingerSchema = z.array(tidslinjeBehandlingSchema)

export type TidslinjeBehandling = z.infer<typeof tidslinjeBehandlingSchema>
export type TidslinjeYrkesaktivitet = z.infer<typeof tidslinjeYrkesaktivitetSchema>
export type TidslinjeTilkommenInntekt = z.infer<typeof tidslinjeTilkommenInntektSchema>
