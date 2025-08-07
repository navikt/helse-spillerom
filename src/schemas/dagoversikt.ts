import { z } from 'zod/v4'

export const dagtypeSchema = z.enum(['Syk', 'SykNav', 'Arbeidsdag', 'Helg', 'Ferie', 'Permisjon', 'Foreldet', 'Avvist'])

export const avvistBegrunnelseSchema = z.enum([
    'Over70',
    'SykepengedagerOppbrukt',
    'SykepengedagerOppbruktOver67',
    'MinimumInntekt',
    'MinimumInntektOver67',
    'EgenmeldingUtenforArbeidsgiverperiode',
    'MinimumSykdomsgrad',
    'ManglerOpptjening',
    'ManglerMedlemskap',
    'EtterDødsdato',
    'AndreYtelserAap',
    'AndreYtelserDagpenger',
    'AndreYtelserForeldrepenger',
    'AndreYtelserOmsorgspenger',
    'AndreYtelserOpplaringspenger',
    'AndreYtelserPleiepenger',
    'AndreYtelserSvangerskapspenger',
    'Ukjent',
])

export const kildeSchema = z.enum(['Søknad', 'Saksbehandler'])

export const dagSchema = z.object({
    dato: z.string(), // ISO date string
    dagtype: dagtypeSchema,
    grad: z.number().nullable(),
    avvistBegrunnelse: z.array(avvistBegrunnelseSchema),
    kilde: kildeSchema.nullable(),
})

export const dagoversiktSchema = z.array(dagSchema)

export type Dag = z.infer<typeof dagSchema>
export type Dagtype = z.infer<typeof dagtypeSchema>
export type AvvistBegrunnelse = z.infer<typeof avvistBegrunnelseSchema>
export type Kilde = z.infer<typeof kildeSchema>
export type Dagoversikt = z.infer<typeof dagoversiktSchema>
