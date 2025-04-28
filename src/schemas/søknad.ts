import { z } from 'zod'

export type Søknadstype = z.infer<typeof søknadstypeSchema>
const søknadstypeSchema = z.union([
    z.literal('SELVSTENDIGE_OG_FRILANSERE'),
    z.literal('OPPHOLD_UTLAND'),
    z.literal('ARBEIDSTAKERE'),
    z.literal('ARBEIDSLEDIG'),
    z.literal('BEHANDLINGSDAGER'),
    z.literal('ANNET_ARBEIDSFORHOLD'),
    z.literal('REISETILSKUDD'),
    z.literal('GRADERT_REISETILSKUDD'),
    z.literal('FRISKMELDT_TIL_ARBEIDSFORMIDLING'),
])

export type Søknadstatus = z.infer<typeof søknadstatusSchema>
const søknadstatusSchema = z.union([
    z.literal('NY'),
    z.literal('SENDT'),
    z.literal('FREMTIDIG'),
    z.literal('UTKAST_TIL_KORRIGERING'),
    z.literal('KORRIGERT'),
    z.literal('AVBRUTT'),
    z.literal('SLETTET'),
    z.literal('UTGAATT'),
])

export type Arbeidssituasjon = z.infer<typeof arbeidssituasjonSchema>
const arbeidssituasjonSchema = z.union([
    z.literal('NAERINGSDRIVENDE'),
    z.literal('FRILANSER'),
    z.literal('ARBEIDSTAKER'),
    z.literal('ARBEIDSLEDIG'),
    z.literal('ANNET'),
    z.literal('FISKER'),
    z.literal('JORDBRUKER'),
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
