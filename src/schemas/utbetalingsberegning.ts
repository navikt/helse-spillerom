import { z } from 'zod/v4'

import { sykepengegrunnlagBaseUnionSchema } from '@schemas/sykepengegrunnlag'

import { yrkesaktivitetSchema } from './yrkesaktivitet'

export const saksbehandlingsperiodeSchema = z.object({
    fom: z.string(), // LocalDate som string
    tom: z.string(), // LocalDate som string
})

// Økonomi-relaterte schemas
export const prosentDtoSchema = z.object({
    prosentDesimal: z.number(),
})

export const økonomiSchema = z.object({
    grad: z.number(),
    totalGrad: z.number(),
    utbetalingsgrad: z.number(),
    arbeidsgiverbeløp: z.number().nullable(),
    personbeløp: z.number().nullable(),
})

// Dag-schema (forenklet - ikke lenger discriminated union)
export const dagSchema = z.object({
    dato: z.string(), // LocalDate som string
    økonomi: økonomiSchema,
})

// Utbetalingstidslinje schema
export const utbetalingstidslinjeSchema = z.object({
    dager: z.array(dagSchema),
})

// Dekningsgrad med sporing
export const dekningsgradMedSporingSchema = z.object({
    sporing: z.string(), // BeregningskoderDekningsgradDto som string
    verdi: prosentDtoSchema,
})

// Yrkesaktivitet utbetalingsberegning schema
export const yrkesaktivitetUtbetalingsberegningSchema = z.object({
    yrkesaktivitetId: z.string(), // UUID som string
    utbetalingstidslinje: utbetalingstidslinjeSchema,
    dekningsgrad: dekningsgradMedSporingSchema.optional(),
})

// SpilleromOppdragDto schemas
export const utbetalingslinjeDtoSchema = z.object({
    fom: z.string(), // LocalDate som string
    tom: z.string(), // LocalDate som string
    beløp: z.number(), // Int
    grad: z.number(), // Int
    klassekode: z.string(), // Klassekode som string
    stønadsdager: z.number(), // Int
})

export const oppdragDtoSchema = z.object({
    mottaker: z.string(),
    fagområde: z.string(),
    linjer: z.array(utbetalingslinjeDtoSchema),
    totalbeløp: z.number(), // Int
})

export const spilleromOppdragDtoSchema = z.object({
    spilleromUtbetalingId: z.string(),
    fnr: z.string(),
    oppdrag: z.array(oppdragDtoSchema),
    maksdato: z.string().nullable(), // LocalDate som string, nullable
})

export const utbetalingsberegningDataSchema = z.object({
    yrkesaktiviteter: z.array(yrkesaktivitetUtbetalingsberegningSchema),
    spilleromOppdrag: spilleromOppdragDtoSchema,
})

export const utbetalingsberegningInputSchema = z.object({
    sykepengegrunnlag: sykepengegrunnlagBaseUnionSchema,
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
export type ProsentDto = z.infer<typeof prosentDtoSchema>
export type Økonomi = z.infer<typeof økonomiSchema>
export type Dag = z.infer<typeof dagSchema>
export type Utbetalingstidslinje = z.infer<typeof utbetalingstidslinjeSchema>
export type DekningsgradMedSporing = z.infer<typeof dekningsgradMedSporingSchema>
export type YrkesaktivitetUtbetalingsberegning = z.infer<typeof yrkesaktivitetUtbetalingsberegningSchema>
export type UtbetalingslinjeDto = z.infer<typeof utbetalingslinjeDtoSchema>
export type OppdragDto = z.infer<typeof oppdragDtoSchema>
export type SpilleromOppdragDto = z.infer<typeof spilleromOppdragDtoSchema>
export type UtbetalingsberegningData = z.infer<typeof utbetalingsberegningDataSchema>
export type UtbetalingsberegningInput = z.infer<typeof utbetalingsberegningInputSchema>
export type BeregningResponse = z.infer<typeof beregningResponseSchema>
