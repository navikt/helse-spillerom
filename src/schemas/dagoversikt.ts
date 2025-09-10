import { z } from 'zod/v4'

export const dagtypeSchema = z.enum([
    'Syk',
    'SykNav',
    'Arbeidsdag',
    'Helg',
    'Ferie',
    'Permisjon',
    'Avslått',
    'AndreYtelser',
])

export const andreYtelserBegrunnelseSchema = z.enum([
    'AndreYtelserAap',
    'AndreYtelserDagpenger',
    'AndreYtelserForeldrepenger',
    'AndreYtelserOmsorgspenger',
    'AndreYtelserOpplaringspenger',
    'AndreYtelserPleiepenger',
    'AndreYtelserSvangerskapspenger',
])

export const kildeSchema = z.enum(['Søknad', 'Saksbehandler'])

export const dagSchema = z.object({
    dato: z.string(), // ISO date string
    dagtype: dagtypeSchema,
    grad: z.number().nullable(),
    avslåttBegrunnelse: z.array(z.string()).optional(),
    andreYtelserBegrunnelse: z.array(z.string()).optional(),
    kilde: kildeSchema.nullable(),
})

export const dagoversiktSchema = z.array(dagSchema)

export type Dag = z.infer<typeof dagSchema>
export type Dagtype = z.infer<typeof dagtypeSchema>
export type Kilde = z.infer<typeof kildeSchema>
export type Dagoversikt = z.infer<typeof dagoversiktSchema>
