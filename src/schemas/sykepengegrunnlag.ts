import { z } from 'zod/v4'

export const inntektskildeSchema = z.enum([
    'AINNTEKT',
    'INNTEKTSMELDING',
    'PENSJONSGIVENDE_INNTEKT',
    'SAKSBEHANDLER',
    'SKJONNSFASTSETTELSE',
])
export type Inntektskilde = z.infer<typeof inntektskildeSchema>

export const refusjonsperiodeSchema = z
    .object({
        fom: z.string(), // ISO 8601 date string
        tom: z.string(), // ISO 8601 date string
        beløpØre: z.number().int().min(0), // Beløp i øre
    })
    .refine((data) => new Date(data.fom) <= new Date(data.tom), {
        message: 'Fra-dato kan ikke være etter til-dato',
    })
export type Refusjonsperiode = z.infer<typeof refusjonsperiodeSchema>

export const inntektSchema = z.object({
    inntektsforholdId: z.string(),
    beløpPerMånedØre: z.number().int().min(0), // Beløp i øre
    kilde: inntektskildeSchema,
    refusjon: z.array(refusjonsperiodeSchema).default([]),
})
export type Inntekt = z.infer<typeof inntektSchema>

export const sykepengegrunnlagRequestSchema = z.object({
    inntekter: z.array(inntektSchema).min(1, 'Må ha minst én inntekt'),
    begrunnelse: z.string().nullable().optional(),
})
export type SykepengegrunnlagRequest = z.infer<typeof sykepengegrunnlagRequestSchema>

export const sykepengegrunnlagResponseSchema = z
    .object({
        id: z.string(),
        saksbehandlingsperiodeId: z.string(),
        inntekter: z.array(inntektSchema),
        totalInntektØre: z.number().int().min(0), // Årsinntekt i øre
        grunnbeløp6GØre: z.number().int().min(0), // 6G i øre
        begrensetTil6G: z.boolean(),
        sykepengegrunnlagØre: z.number().int().min(0), // Endelig grunnlag i øre
        begrunnelse: z.string().nullable().optional(),
        grunnbeløpVirkningstidspunkt: z.string(), // ISO 8601 date string
        opprettet: z.string(),
        opprettetAv: z.string(),
        sistOppdatert: z.string(),
    })
    .nullable()
export type SykepengegrunnlagResponse = z.infer<typeof sykepengegrunnlagResponseSchema>

// Utility functions for converting between kroner and øre
export function kronerTilØrer(kroner: number): number {
    return Math.round(kroner * 100)
}

export function ørerTilKroner(ører: number): number {
    return ører / 100
}

export function formaterBeløpØre(ører: number | undefined): string {
    if (ører === undefined) return '-'
    return new Intl.NumberFormat('nb-NO', {
        style: 'currency',
        currency: 'NOK',
    }).format(ørerTilKroner(ører))
}
