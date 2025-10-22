import { z } from 'zod/v4'

// Hjelpeklasser
export const inntektAarSchema = z.object({
    år: z.string(),
    rapportertinntekt: z.number(),
    justertÅrsgrunnlag: z.number(),
    antallGKompensert: z.number(),
    snittG: z.number(),
})

export const pensjonsgivendeInntektSchema = z.object({
    omregnetÅrsinntekt: z.number(),
    pensjonsgivendeInntekt: z.array(inntektAarSchema),
    anvendtGrunnbeløp: z.number(),
})

// InntektData typer
export const arbeidstakerInntektsmeldingSchema = z.object({
    inntektstype: z.literal('ARBEIDSTAKER_INNTEKTSMELDING'),
    inntektsmeldingId: z.string(),
    omregnetÅrsinntekt: z.number(),
    sporing: z.string(),
})

export const arbeidstakerManueltBeregnetSchema = z.object({
    inntektstype: z.literal('ARBEIDSTAKER_MANUELT_BEREGNET'),
    omregnetÅrsinntekt: z.number(),
    sporing: z.string(),
})

export const arbeidstakerAinntektSchema = z.object({
    inntektstype: z.literal('ARBEIDSTAKER_AINNTEKT'),
    omregnetÅrsinntekt: z.number(),
    sporing: z.string(),
})

export const arbeidstakerSkjønnsfastsattSchema = z.object({
    inntektstype: z.literal('ARBEIDSTAKER_SKJØNNSFASTSATT'),
    omregnetÅrsinntekt: z.number(),
    sporing: z.string(),
})

export const frilanserAinntektSchema = z.object({
    inntektstype: z.literal('FRILANSER_AINNTEKT'),
    omregnetÅrsinntekt: z.number(),
    sporing: z.string(),
})

export const frilanserSkjønnsfastsattSchema = z.object({
    inntektstype: z.literal('FRILANSER_SKJØNNSFASTSATT'),
    omregnetÅrsinntekt: z.number(),
    sporing: z.string(),
})

export const arbeidsledigSchema = z.object({
    inntektstype: z.literal('ARBEIDSLEDIG'),
    omregnetÅrsinntekt: z.number(),
    sporing: z.string(),
})

export const inaktivPensjonsgivendeSchema = z.object({
    inntektstype: z.literal('INAKTIV_PENSJONSGIVENDE'),
    omregnetÅrsinntekt: z.number(),
    sporing: z.string(),
    pensjonsgivendeInntekt: pensjonsgivendeInntektSchema,
})

export const inaktivSkjønnsfastsattSchema = z.object({
    inntektstype: z.literal('INAKTIV_SKJØNNSFASTSATT'),
    omregnetÅrsinntekt: z.number(),
    sporing: z.string(),
})

export const selvstendigNæringsdrivendePensjonsgivendeSchema = z.object({
    inntektstype: z.literal('SELVSTENDIG_NÆRINGSDRIVENDE_PENSJONSGIVENDE'),
    omregnetÅrsinntekt: z.number(),
    sporing: z.string(),
    pensjonsgivendeInntekt: pensjonsgivendeInntektSchema,
})

export const selvstendigNæringsdrivendeSkjønnsfastsattSchema = z.object({
    inntektstype: z.literal('SELVSTENDIG_NÆRINGSDRIVENDE_SKJØNNSFASTSATT'),
    omregnetÅrsinntekt: z.number(),
    sporing: z.string(),
})

// Hovedunion for alle inntekt data
export const inntektDataSchema = z.discriminatedUnion('inntektstype', [
    arbeidstakerInntektsmeldingSchema,
    arbeidstakerManueltBeregnetSchema,
    arbeidstakerAinntektSchema,
    arbeidstakerSkjønnsfastsattSchema,
    frilanserAinntektSchema,
    frilanserSkjønnsfastsattSchema,
    arbeidsledigSchema,
    inaktivPensjonsgivendeSchema,
    inaktivSkjønnsfastsattSchema,
    selvstendigNæringsdrivendePensjonsgivendeSchema,
    selvstendigNæringsdrivendeSkjønnsfastsattSchema,
])

// Type exports
export type InntektData = z.infer<typeof inntektDataSchema>
export type InntektAar = z.infer<typeof inntektAarSchema>
export type PensjonsgivendeInntekt = z.infer<typeof pensjonsgivendeInntektSchema>
export type ArbeidstakerInntektsmelding = z.infer<typeof arbeidstakerInntektsmeldingSchema>
export type ArbeidstakerManueltBeregnet = z.infer<typeof arbeidstakerManueltBeregnetSchema>
export type ArbeidstakerAinntekt = z.infer<typeof arbeidstakerAinntektSchema>
export type ArbeidstakerSkjønnsfastsatt = z.infer<typeof arbeidstakerSkjønnsfastsattSchema>
export type FrilanserAinntekt = z.infer<typeof frilanserAinntektSchema>
export type FrilanserSkjønnsfastsatt = z.infer<typeof frilanserSkjønnsfastsattSchema>
export type Arbeidsledig = z.infer<typeof arbeidsledigSchema>
export type InaktivPensjonsgivende = z.infer<typeof inaktivPensjonsgivendeSchema>
export type InaktivSkjønnsfastsatt = z.infer<typeof inaktivSkjønnsfastsattSchema>
export type SelvstendigNæringsdrivendePensjonsgivende = z.infer<typeof selvstendigNæringsdrivendePensjonsgivendeSchema>
export type SelvstendigNæringsdrivendeSkjønnsfastsatt = z.infer<typeof selvstendigNæringsdrivendeSkjønnsfastsattSchema>
