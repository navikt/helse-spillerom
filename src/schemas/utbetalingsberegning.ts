import { z } from 'zod/v4'

import { sykepengegrunnlagResponseSchema } from './sykepengegrunnlag'
import { yrkesaktivitetSchema } from './yrkesaktivitet'

export const dagUtbetalingsberegningSchema = z.object({
    dato: z.string(), // LocalDate som string
    utbetalingØre: z.number(),
    refusjonØre: z.number(),
    totalGrad: z.number(),
})

export const yrkesaktivitetUtbetalingsberegningSchema = z.object({
    yrkesaktivitetId: z.string(), // UUID som string
    dager: z.array(dagUtbetalingsberegningSchema),
})

export const utbetalingsberegningDataSchema = z.object({
    yrkesaktiviteter: z.array(yrkesaktivitetUtbetalingsberegningSchema),
})

export const utbetalingsberegningInputSchema = z.object({
    sykepengegrunnlag: sykepengegrunnlagResponseSchema,
    yrkesaktivitet: z.array(yrkesaktivitetSchema),
})

export const beregningResponseSchema = z.object({
    id: z.string(), // UUID som string
    saksbehandlingsperiodeId: z.string(), // UUID som string
    beregningData: utbetalingsberegningDataSchema,
    opprettet: z.string(),
    opprettetAv: z.string(),
    sistOppdatert: z.string(),
})

export type DagUtbetalingsberegning = z.infer<typeof dagUtbetalingsberegningSchema>
export type YrkesaktivitetUtbetalingsberegning = z.infer<typeof yrkesaktivitetUtbetalingsberegningSchema>
export type UtbetalingsberegningData = z.infer<typeof utbetalingsberegningDataSchema>
export type UtbetalingsberegningInput = z.infer<typeof utbetalingsberegningInputSchema>
export type BeregningResponse = z.infer<typeof beregningResponseSchema>
