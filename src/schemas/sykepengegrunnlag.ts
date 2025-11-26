import { z } from 'zod/v4'

// Næringsdel schema basert på bakrommet Domene.kt
export const næringsdelSchema = z.object({
    pensjonsgivendeÅrsinntekt: z.number(), // Årsinntekt i øre
    pensjonsgivendeÅrsinntekt6GBegrenset: z.number(), // 6G begrenset årsinntekt i øre
    pensjonsgivendeÅrsinntektBegrensetTil6G: z.boolean(),
    næringsdel: z.number(), // Næringsdel i øre
    sumAvArbeidsinntekt: z.number(), // Sum av arbeidsinntekt i øre
})

// Sammenlikningsgrunnlag schema basert på bakrommet Domene.kt
export const sammenlikningsgrunnlagSchema = z.object({
    totaltSammenlikningsgrunnlag: z.number(), // Totalt sammenlikningsgrunnlag i øre
    avvikProsent: z.number(), // Avvik i prosent
    avvikMotInntektsgrunnlag: z.number(), // Avvik mot inntektsgrunnlag i øre
    basertPåDokumentId: z.string(), // UUID som string
})

// Base schema for SykepengegrunnlagBase (felles felter)
const sykepengegrunnlagBaseSchema = z.object({
    grunnbeløp: z.number(), // 1G i øre
    beregningsgrunnlag: z.number(), // Totalt inntektsgrunnlag i øre
    sykepengegrunnlag: z.number(), // Endelig sykepengegrunnlag i øre
    seksG: z.number(), // 6G i øre
    begrensetTil6G: z.boolean(),
    grunnbeløpVirkningstidspunkt: z.string(), // ISO 8601 date string
})

// Sykepengegrunnlag schema (type: "SYKEPENGEGRUNNLAG")
export const sykepengegrunnlagSchema = sykepengegrunnlagBaseSchema.extend({
    type: z.literal('SYKEPENGEGRUNNLAG'),
    næringsdel: næringsdelSchema.nullable(),
    kombinertBeregningskode: z.string().nullable(),
})

// FrihåndSykepengegrunnlag schema (type: "FRIHÅND_SYKEPENGEGRUNNLAG")
export const frihåndSykepengegrunnlagSchema = sykepengegrunnlagBaseSchema.extend({
    type: z.literal('FRIHÅND_SYKEPENGEGRUNNLAG'),
    begrunnelse: z.string(),
    beregningskoder: z.array(z.string()), // List<BeregningskoderSykepengegrunnlag>
})

// Discriminated union for SykepengegrunnlagBase
export const sykepengegrunnlagBaseUnionSchema = z.discriminatedUnion('type', [
    sykepengegrunnlagSchema,
    frihåndSykepengegrunnlagSchema,
])

// Ny respons schema som inneholder både sykepengegrunnlag og sammenlikningsgrunnlag
export const sykepengegrunnlagResponseSchema = z.object({
    sykepengegrunnlag: sykepengegrunnlagBaseUnionSchema.nullable(),
    sammenlikningsgrunnlag: sammenlikningsgrunnlagSchema.nullable(),
    opprettetForBehandling: z.string(), // UUID som string
})

// Request schema for å opprette sykepengegrunnlag
export const opprettSykepengegrunnlagRequestSchema = z.object({
    beregningsgrunnlag: z.number(), // BigDecimal som number (i øre)
    begrunnelse: z.string(),
    datoForGBegrensning: z.string().nullable().optional(), // LocalDate som ISO 8601 string
    beregningskoder: z.array(z.string()), // List<BeregningskoderSykepengegrunnlag>
})

export type Sykepengegrunnlag = z.infer<typeof sykepengegrunnlagSchema>
export type FrihåndSykepengegrunnlag = z.infer<typeof frihåndSykepengegrunnlagSchema>
export type SykepengegrunnlagBase = z.infer<typeof sykepengegrunnlagBaseUnionSchema>
export type Næringsdel = z.infer<typeof næringsdelSchema>
export type Sammenlikningsgrunnlag = z.infer<typeof sammenlikningsgrunnlagSchema>
export type SykepengegrunnlagResponse = z.infer<typeof sykepengegrunnlagResponseSchema>
export type OpprettSykepengegrunnlagRequest = z.infer<typeof opprettSykepengegrunnlagRequestSchema>
