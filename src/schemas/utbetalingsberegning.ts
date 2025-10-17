import { z } from 'zod/v4'

import { sykepengegrunnlagV2Schema } from '@schemas/sykepengegrunnlagV2'

import { yrkesaktivitetSchema } from './yrkesaktivitet'

export const saksbehandlingsperiodeSchema = z.object({
    fom: z.string(), // LocalDate som string
    tom: z.string(), // LocalDate som string
})

// Økonomi-relaterte schemas
export const beløpSchema = z.object({
    årlig: z.object({ beløp: z.number() }),
    månedligDouble: z.object({ beløp: z.number() }),
    dagligDouble: z.object({ beløp: z.number() }),
    dagligInt: z.object({ beløp: z.number() }),
})

export const prosentDtoSchema = z.object({
    prosentDesimal: z.number(),
})

export const økonomiSchema = z.object({
    grad: prosentDtoSchema,
    totalGrad: prosentDtoSchema,
    utbetalingsgrad: prosentDtoSchema,
    arbeidsgiverRefusjonsbeløp: beløpSchema,
    aktuellDagsinntekt: beløpSchema,
    inntektjustering: beløpSchema,
    dekningsgrad: prosentDtoSchema,
    arbeidsgiverbeløp: beløpSchema,
    personbeløp: beløpSchema,
    reservertArbeidsgiverbeløp: beløpSchema,
    reservertPersonbeløp: beløpSchema,
})

// Dag-schemas
export const navDagDtoSchema = z.object({
    '@type': z.literal('NavDagDto'),
    dato: z.string(), // LocalDate som string
    økonomi: økonomiSchema,
})

export const navHelgDagDtoSchema = z.object({
    '@type': z.literal('NavHelgDagDto'),
    dato: z.string(), // LocalDate som string
    økonomi: økonomiSchema,
})

export const arbeidsgiverperiodeDagDtoSchema = z.object({
    '@type': z.literal('ArbeidsgiverperiodeDagDto'),
    dato: z.string(), // LocalDate som string
    økonomi: økonomiSchema,
})

export const arbeidsgiverperiodeDagNavDtoSchema = z.object({
    '@type': z.literal('ArbeidsgiverperiodeDagNavDto'),
    dato: z.string(), // LocalDate som string
    økonomi: økonomiSchema,
})

export const fridagDtoSchema = z.object({
    '@type': z.literal('FridagDto'),
    dato: z.string(), // LocalDate som string
    økonomi: økonomiSchema,
})

export const arbeidsdagDtoSchema = z.object({
    '@type': z.literal('ArbeidsdagDto'),
    dato: z.string(), // LocalDate som string
    økonomi: økonomiSchema,
})

export const foreldetDagDtoSchema = z.object({
    '@type': z.literal('ForeldetDagDto'),
    dato: z.string(), // LocalDate som string
    økonomi: økonomiSchema,
})

export const ukjentDagDtoSchema = z.object({
    '@type': z.literal('UkjentDagDto'),
    dato: z.string(), // LocalDate som string
    økonomi: økonomiSchema,
})

export const ventetidsdagDtoSchema = z.object({
    '@type': z.literal('VentetidsdagDto'),
    dato: z.string(), // LocalDate som string
    økonomi: økonomiSchema,
})
export const avvistdagDtoSchema = z.object({
    '@type': z.literal('avvistdagDtoSchema'),
    dato: z.string(), // LocalDate som string
    økonomi: økonomiSchema,
})

export const dagSchema = z.discriminatedUnion('@type', [
    navDagDtoSchema,
    navHelgDagDtoSchema,
    arbeidsgiverperiodeDagDtoSchema,
    arbeidsgiverperiodeDagNavDtoSchema,
    fridagDtoSchema,
    arbeidsdagDtoSchema,
    foreldetDagDtoSchema,
    ukjentDagDtoSchema,
    ventetidsdagDtoSchema,
    avvistdagDtoSchema,
])

// Utbetalingstidslinje schema
export const utbetalingstidslinjeSchema = z.object({
    dager: z.array(dagSchema),
})

// Dekningsgrad med sporing
export const dekningsgradMedSporingSchema = z.object({
    sporing: z.string(),
    verdi: prosentDtoSchema,
})

// Yrkesaktivitet utbetalingsberegning schema
export const yrkesaktivitetUtbetalingsberegningSchema = z.object({
    yrkesaktivitetId: z.string(), // UUID som string
    utbetalingstidslinje: utbetalingstidslinjeSchema,
    dekningsgrad: dekningsgradMedSporingSchema.optional(),
})

// Oppdrag schemas (kan ignoreres for nå, men inkludert for komplett struktur)
export const endringskodeSchema = z.discriminatedUnion('@type', [
    z.object({ '@type': z.literal('NY') }),
    z.object({ '@type': z.literal('ENDR') }),
    z.object({ '@type': z.literal('ANUL') }),
])

export const fagområdeSchema = z.discriminatedUnion('@type', [
    z.object({ '@type': z.literal('SPREF') }),
    z.object({ '@type': z.literal('SP') }),
])

export const klassekodeSchema = z.discriminatedUnion('@type', [
    z.object({
        '@type': z.literal('SykepengerArbeidstakerOrdinær'),
        verdi: z.string(),
    }),
    z.object({
        '@type': z.literal('RefusjonIkkeOpplysningspliktig'),
        verdi: z.string(),
    }),
    z.object({
        '@type': z.literal('SelvstendigNæringsdrivendeOppgavepliktig'),
        verdi: z.string(),
    }),
    z.object({
        '@type': z.literal('SelvstendigNæringsdrivendeFisker'),
        verdi: z.string(),
    }),
    z.object({
        '@type': z.literal('SelvstendigNæringsdrivendeJordbrukOgSkogbruk'),
        verdi: z.string(),
    }),
    z.object({
        '@type': z.literal('SelvstendigNæringsdrivendeBarnepasserOppgavepliktig'),
        verdi: z.string(),
    }),
])

export const oppdragLinjeSchema = z.object({
    fom: z.string(),
    tom: z.string(),
    beløp: z.number(),
    grad: z.number(),
    stønadsdager: z.number(),
    totalbeløp: z.number(),
    refFagsystemId: z.string().nullable(),
    delytelseId: z.number(),
    refDelytelseId: z.number().nullable(),
    endringskode: endringskodeSchema,
    klassekode: klassekodeSchema,
    datoStatusFom: z.string().nullable(),
    statuskode: z.string().nullable(),
})

export const oppdragSchema = z.object({
    mottaker: z.string(),
    fagområde: fagområdeSchema,
    linjer: z.array(oppdragLinjeSchema),
    fagsystemId: z.string(),
    endringskode: endringskodeSchema,
    nettoBeløp: z.number(),
    stønadsdager: z.number(),
    totalbeløp: z.number(),
    overføringstidspunkt: z.string().nullable(),
    avstemmingsnøkkel: z.string().nullable(),
    status: z.string().nullable(),
    tidsstempel: z.string(),
    erSimulert: z.boolean(),
    simuleringsResultat: z.any().nullable(),
})

export const utbetalingsberegningDataSchema = z.object({
    yrkesaktiviteter: z.array(yrkesaktivitetUtbetalingsberegningSchema),
    oppdrag: z.array(oppdragSchema).optional(),
})

export const utbetalingsberegningInputSchema = z.object({
    sykepengegrunnlag: sykepengegrunnlagV2Schema,
    yrkesaktivitet: z.array(yrkesaktivitetSchema),
    saksbehandlingsperiode: saksbehandlingsperiodeSchema,
})

export const beregningResponseSchema = z.object({
    id: z.string(), // UUID som string
    saksbehandlingsperiodeId: z.string(), // UUID som string
    beregningData: utbetalingsberegningDataSchema,
    opprettet: z.string(),
    opprettetAv: z.string(),
    sistOppdatert: z.string(),
})

export type Saksbehandlingsperiode = z.infer<typeof saksbehandlingsperiodeSchema>
export type Beløp = z.infer<typeof beløpSchema>
export type ProsentDto = z.infer<typeof prosentDtoSchema>
export type Økonomi = z.infer<typeof økonomiSchema>
export type NavDagDto = z.infer<typeof navDagDtoSchema>
export type NavHelgDagDto = z.infer<typeof navHelgDagDtoSchema>
export type ArbeidsgiverperiodeDagDto = z.infer<typeof arbeidsgiverperiodeDagDtoSchema>
export type ArbeidsgiverperiodeDagNavDto = z.infer<typeof arbeidsgiverperiodeDagNavDtoSchema>
export type FridagDto = z.infer<typeof fridagDtoSchema>
export type ArbeidsdagDto = z.infer<typeof arbeidsdagDtoSchema>
export type ForeldetDagDto = z.infer<typeof foreldetDagDtoSchema>
export type UkjentDagDto = z.infer<typeof ukjentDagDtoSchema>
export type VentetidsdagDto = z.infer<typeof ventetidsdagDtoSchema>
export type Dag = z.infer<typeof dagSchema>
export type Utbetalingstidslinje = z.infer<typeof utbetalingstidslinjeSchema>
export type DekningsgradMedSporing = z.infer<typeof dekningsgradMedSporingSchema>
export type YrkesaktivitetUtbetalingsberegning = z.infer<typeof yrkesaktivitetUtbetalingsberegningSchema>
export type Oppdrag = z.infer<typeof oppdragSchema>
export type OppdragLinje = z.infer<typeof oppdragLinjeSchema>
export type UtbetalingsberegningData = z.infer<typeof utbetalingsberegningDataSchema>
export type UtbetalingsberegningInput = z.infer<typeof utbetalingsberegningInputSchema>
export type BeregningResponse = z.infer<typeof beregningResponseSchema>
