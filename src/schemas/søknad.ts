import { z } from 'zod'

export type Søknadstype = z.infer<typeof søknadstypeSchema>
const søknadstypeSchema = z.enum([
    'SELVSTENDIGE_OG_FRILANSERE',
    'OPPHOLD_UTLAND',
    'ARBEIDSTAKERE',
    'ARBEIDSLEDIG',
    'BEHANDLINGSDAGER',
    'ANNET_ARBEIDSFORHOLD',
    'REISETILSKUDD',
    'GRADERT_REISETILSKUDD',
    'FRISKMELDT_TIL_ARBEIDSFORMIDLING',
])

export type Søknadstatus = z.infer<typeof søknadstatusSchema>
const søknadstatusSchema = z.enum([
    'NY',
    'SENDT',
    'FREMTIDIG',
    'UTKAST_TIL_KORRIGERING',
    'KORRIGERT',
    'AVBRUTT',
    'SLETTET',
    'UTGAATT',
])

export type Arbeidssituasjon = z.infer<typeof arbeidssituasjonSchema>
const arbeidssituasjonSchema = z.enum([
    'NAERINGSDRIVENDE',
    'FRILANSER',
    'ARBEIDSTAKER',
    'ARBEIDSLEDIG',
    'ANNET',
    'FISKER',
    'JORDBRUKER',
])

export type Arbeidsgiver = z.infer<typeof arbeidssituasjonSchema>
const arbeidsgiverSchema = z.object({
    navn: z.string(),
    orgnummer: z.string(),
})

export type Søknadsperiode = z.infer<typeof søknadsperiodeSchema>
const søknadsperiodeSchema = z.object({
    fom: z.string(),
    tom: z.string(),
    grad: z.number(),
    sykmeldingstype: z.string(),
})

export type Søknad = z.infer<typeof søknadSchema>
export const søknadSchema = z.object({
    id: z.string(),
    søknadstype: søknadstypeSchema,
    status: søknadstatusSchema,
    arbeidssituasjon: arbeidssituasjonSchema.nullable(),
    fom: z.string().nullable(),
    tom: z.string().nullable(),
    korrigerer: z.string().nullable(),
    korrigertAv: z.string().nullable(),
    avbruttDato: z.string().nullable(),
    sykmeldingUtskrevet: z.string().nullable(),
    startSykeforlop: z.string().nullable(),
    opprettetDato: z.string(),
    sendtTilNAVDato: z.string().nullable(),
    sendtTilArbeidsgiverDato: z.string().nullable(),
    arbeidsgiver: arbeidsgiverSchema.nullable(),
    søknadsPerioder: z.array(søknadsperiodeSchema),
})
