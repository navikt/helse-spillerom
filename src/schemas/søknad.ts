import { z } from 'zod/v4'

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
    'SELVSTENDIG_NARINGSDRIVENDE',
    'FRILANSER',
    'ARBEIDSTAKER',
    'ARBEIDSLEDIG',
    'ANNET',
    'FISKER',
    'JORDBRUKER',
])

export type Arbeidsgiver = z.infer<typeof arbeidsgiverSchema>
const arbeidsgiverSchema = z.object({
    navn: z.string(),
    orgnummer: z.string(),
})

export type Søknadsperiode = z.infer<typeof søknadsperiodeSchema>
const søknadsperiodeSchema = z.object({
    fom: z.string(),
    tom: z.string(),
    grad: z.number().nullable(),
    sykmeldingsgrad: z.number().nullable().optional(),
    faktiskGrad: z.number().nullable().optional(),
    sykmeldingstype: z.string(),
})

export type Fravartype = z.infer<typeof fravartypeSchema>
const fravartypeSchema = z.enum(['FERIE', 'PERMISJON'])

export type Fravar = z.infer<typeof fravarSchema>
const fravarSchema = z.object({
    fom: z.string(),
    tom: z.string().nullable().optional(),
    type: fravartypeSchema,
})

export const svartypeEnum = z.enum([
    'CHECKBOX',
    'RADIO',
    'DATO',
    'DATOER',
    'PERIODE',
    'PERIODER',
    'CHECKBOX_GRUPPE',
    'COMBOBOX_MULTI',
    'PROSENT',
    'TIMER',
    'KILOMETER',
    'JA_NEI',
    'RADIO_GRUPPE_TIMER_PROSENT',
    'RADIO_GRUPPE_UKEKALENDER',
    'INFO_BEHANDLINGSDAGER',
    'BELOP',
    'OPPSUMMERING',
    'CHECKBOX_PANEL',
    'RADIO_GRUPPE',
    'GRUPPE_AV_UNDERSPORSMAL',
    'IKKE_RELEVANT',
])

export type Svartype = z.infer<typeof svartypeEnum>

export const svarSchema = z.object({
    verdi: z.string(),
})

export type Svar = z.infer<typeof svarSchema>

export const sporsmalSchema: z.ZodType<{
    id: string
    tag: string
    sporsmalstekst: string | null
    undertekst: string | null
    min?: string | null
    max?: string | null
    svartype: Svartype
    kriterieForVisningAvUndersporsmal?: string | null
    svar?: Svar[]
    undersporsmal?: z.infer<typeof sporsmalSchema>[]
    metadata?: unknown | null
}> = z.object({
    id: z.string(),
    tag: z.string(),
    sporsmalstekst: z.string().nullable(),
    undertekst: z.string().nullable(),
    min: z.string().nullable().optional(),
    max: z.string().nullable().optional(),
    svartype: svartypeEnum,
    kriterieForVisningAvUndersporsmal: z.string().nullable().optional(),
    svar: z.array(svarSchema).optional(),
    undersporsmal: z.array(z.lazy(() => sporsmalSchema)).optional(),
    metadata: z.unknown().nullable().optional(),
})

export type Sporsmal = z.infer<typeof sporsmalSchema>

export type Søknad = z.infer<typeof søknadSchema>
export const søknadSchema = z.object({
    id: z.string(),
    type: søknadstypeSchema,
    status: søknadstatusSchema,
    arbeidssituasjon: arbeidssituasjonSchema.nullable(),
    fom: z.string().nullable(),
    tom: z.string().nullable(),
    korrigerer: z.string().nullable(),
    korrigertAv: z.string().nullable(),
    sykmeldingSkrevet: z.string().nullable(),
    startSyketilfelle: z.string().nullable(),
    opprettet: z.string(),
    sendtNav: z.string().nullable(),
    sendtArbeidsgiver: z.string().nullable(),
    arbeidsgiver: arbeidsgiverSchema.nullable().optional(),
    soknadsperioder: z.array(søknadsperiodeSchema),
    fravar: z.array(fravarSchema).nullable().optional(),
    arbeidGjenopptatt: z.string().nullable().optional(),
    egenmeldingsdagerFraSykmelding: z.array(z.string()).nullable().optional(),
    sporsmal: z.array(sporsmalSchema).optional(),
})
