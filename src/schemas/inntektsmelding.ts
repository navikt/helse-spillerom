import { z } from 'zod'

export const ArbeidsgivertypeSchema = z.enum(['PRIVAT', 'VIRKSOMHET'])

export const StatusSchema = z.enum(['GYLDIG', 'MANGELFULL'])

export const ArsakTilInnsendingSchema = z.enum(['Ny', 'Endring'])

export const MottaksKanalSchema = z.enum(['ALTINN', 'NAV_NO', 'HR_SYSTEM_API'])

export const FormatSchema = z.enum(['Inntektsmelding', 'Arbeidsgiveropplysninger'])

export const NaturalytelseEnum = z.enum([
    'KOSTDOEGN',
    'LOSJI',
    'ANNET',
    'SKATTEPLIKTIGDELFORSIKRINGER',
    'BIL',
    'KOSTDAGER',
    'RENTEFORDELLAAN',
    'BOLIG',
    'ELEKTRONISKKOMMUNIKASJON',
    'AKSJERGRUNNFONDSBEVISTILUNDERKURS',
    'OPSJONER',
    'KOSTBESPARELSEIHJEMMET',
    'FRITRANSPORT',
    'BEDRIFTSBARNEHAGEPLASS',
    'TILSKUDDBARNEHAGEPLASS',
    'BESOEKSREISERHJEMMETANNET',
    'INNBETALINGTILUTENLANDSKPENSJONSORDNING',
    'YRKEBILTJENESTLIGBEHOVLISTEPRIS',
    'YRKEBILTJENESTLIGBEHOVKILOMETER',
])

export const PeriodeSchema = z.object({
    fom: z.string(),
    tom: z.string(),
})

export const RefusjonSchema = z.object({
    beloepPrMnd: z.string().nullable(),
    opphoersdato: z.string().nullable(),
})

export const EndringIRefusjonSchema = z.object({
    endringsdato: z.string().nullable(),
    beloep: z.string().nullable(),
})

export const AvsenderSystemSchema = z.object({
    navn: z.string().nullable(),
    versjon: z.string().nullable(),
})

export const InntektEndringÅrsakSchema = z.object({
    aarsak: z.string(),
    perioder: z.array(PeriodeSchema).nullable(),
    gjelderFra: z.string().nullable(),
    bleKjent: z.string().nullable(),
})

export const OpphørAvNaturalytelseSchema = z.object({
    naturalytelse: NaturalytelseEnum.nullable(),
    fom: z.string().nullable(),
    beloepPrMnd: z.string().nullable(),
})

export const GjenopptakelseNaturalytelseSchema = z.object({
    // I inntektsmeldingkontrakten til HAG har de en JsonProperty-annotasjon med stor Y
    // Tok nesten ikke noe tid å finne ut av 💩
    naturalYtelse: NaturalytelseEnum.nullable(),
    fom: z.string().nullable(),
    beloepPrMnd: z.string().nullable(),
})

export const InntektsmeldingSchema = z.object({
    inntektsmeldingId: z.string(),
    vedtaksperiodeId: z.string().nullable().optional(),
    arbeidstakerFnr: z.string(),
    arbeidstakerAktorId: z.string(),
    virksomhetsnummer: z.string().nullable().optional(),
    arbeidsgiverFnr: z.string().nullable().optional(),
    arbeidsgiverAktorId: z.string().nullable().optional(),
    innsenderFulltNavn: z.string(),
    innsenderTelefon: z.string(),
    begrunnelseForReduksjonEllerIkkeUtbetalt: z.string().nullable().optional(),
    bruttoUtbetalt: z.string().nullable().optional(),
    arbeidsgivertype: ArbeidsgivertypeSchema,
    arbeidsforholdId: z.string().nullable().optional(),
    beregnetInntekt: z.string().nullable().optional(),
    inntektsdato: z.string().nullable().optional(),
    refusjon: RefusjonSchema,
    endringIRefusjoner: z.array(EndringIRefusjonSchema).default([]),
    opphoerAvNaturalytelser: z.array(OpphørAvNaturalytelseSchema).default([]),
    gjenopptakelseNaturalytelser: z.array(GjenopptakelseNaturalytelseSchema).default([]),
    arbeidsgiverperioder: z.array(PeriodeSchema),
    status: StatusSchema,
    arkivreferanse: z.string(),
    ferieperioder: z.array(PeriodeSchema).default([]),
    foersteFravaersdag: z.string().nullable().optional(),
    mottattDato: z.string(),
    naerRelasjon: z.boolean().nullable().optional(),
    avsenderSystem: AvsenderSystemSchema.nullable().optional(),
    inntektEndringAarsak: InntektEndringÅrsakSchema.nullable().optional(),
    inntektEndringAarsaker: z.array(InntektEndringÅrsakSchema).nullable().optional(),
    arsakTilInnsending: ArsakTilInnsendingSchema.default('Ny'),
    mottaksKanal: MottaksKanalSchema.nullable().optional(),
    format: FormatSchema.nullable().optional(),
    forespurt: z.boolean().default(false),
})

export type Inntektsmelding = z.infer<typeof InntektsmeldingSchema>
export type Arbeidsgivertype = z.infer<typeof ArbeidsgivertypeSchema>
export type Status = z.infer<typeof StatusSchema>
export type ArsakTilInnsending = z.infer<typeof ArsakTilInnsendingSchema>
export type MottaksKanal = z.infer<typeof MottaksKanalSchema>
export type Format = z.infer<typeof FormatSchema>
export type Periode = z.infer<typeof PeriodeSchema>
export type Refusjon = z.infer<typeof RefusjonSchema>
export type EndringIRefusjon = z.infer<typeof EndringIRefusjonSchema>
export type AvsenderSystem = z.infer<typeof AvsenderSystemSchema>
export type InntektEndringÅrsak = z.infer<typeof InntektEndringÅrsakSchema>
export type OpphørAvNaturalYtelse = z.infer<typeof OpphørAvNaturalytelseSchema>
export type GjenopptakelseNaturalytelse = z.infer<typeof GjenopptakelseNaturalytelseSchema>
