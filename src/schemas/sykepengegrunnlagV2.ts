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

// Sykepengegrunnlag v2 schema basert på bakrommet Domene.kt
export const sykepengegrunnlagV2Schema = z.object({
    grunnbeløp: z.number(), // 1G i øre
    totaltInntektsgrunnlag: z.number(), // Totalt inntektsgrunnlag i øre
    sykepengegrunnlag: z.number(), // Endelig sykepengegrunnlag i øre
    seksG: z.number(), // 6G i øre
    begrensetTil6G: z.boolean(),
    grunnbeløpVirkningstidspunkt: z.string(), // ISO 8601 date string
    næringsdel: næringsdelSchema.nullable(),
    kombinertBeregningskode: z.string().nullable(),
})

// Ny respons schema som inneholder både sykepengegrunnlag og sammenlikningsgrunnlag
export const sykepengegrunnlagResponseSchema = z.object({
    sykepengegrunnlag: sykepengegrunnlagV2Schema.nullable(),
    sammenlikningsgrunnlag: sammenlikningsgrunnlagSchema.nullable(),
})

export type SykepengegrunnlagV2 = z.infer<typeof sykepengegrunnlagV2Schema>
export type Næringsdel = z.infer<typeof næringsdelSchema>
export type Sammenlikningsgrunnlag = z.infer<typeof sammenlikningsgrunnlagSchema>
export type SykepengegrunnlagResponse = z.infer<typeof sykepengegrunnlagResponseSchema>
