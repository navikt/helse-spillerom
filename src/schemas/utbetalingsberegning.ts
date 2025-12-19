import { z } from 'zod/v4'

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

export const dagSchema = z.object({
    dato: z.string(), // LocalDate som string
    økonomi: økonomiSchema,
})

export const utbetalingstidslinjeSchema = z.object({
    dager: z.array(dagSchema),
})

export const dekningsgradMedSporingSchema = z.object({
    sporing: z.string(), // BeregningskoderDekningsgradDto som string
    verdi: prosentDtoSchema,
})

export const yrkesaktivitetUtbetalingsberegningSchema = z.object({
    yrkesaktivitetId: z.string(), // UUID som string
    utbetalingstidslinje: utbetalingstidslinjeSchema,
    dekningsgrad: dekningsgradMedSporingSchema.optional(),
})

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

export const beregningResponseSchema = z.object({
    id: z.string(), // UUID som string
    saksbehandlingsperiodeId: z.string(), // UUID som string
    beregningData: utbetalingsberegningDataSchema,
    opprettet: z.string(),
    opprettetAv: z.string(),
    sistOppdatert: z.string(),
})

export type BeregningResponse = z.infer<typeof beregningResponseSchema>
export type YrkesaktivitetUtbetalingsberegning = z.infer<typeof yrkesaktivitetUtbetalingsberegningSchema>
