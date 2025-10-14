import { z } from 'zod/v4'

// Hjelpeklasser
export const refusjonInfoSchema = z.object({
    fra: z.string(), // LocalDate som string
    til: z.string(), // LocalDate som string
    beløp: z.number(),
})

export type RefusjonInfo = z.infer<typeof refusjonInfoSchema>

// Arbeidstaker inntekt typer
export const arbeidstakerSkjønnsfastsettelseÅrsakSchema = z.enum([
    'AVVIK_25_PROSENT',
    'MANGFULL_RAPPORTERING',
    'TIDSAVGRENSET',
])

export const arbeidstakerInntektRequestSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('INNTEKTSMELDING'),
        inntektsmeldingId: z.string(),
    }),
    z.object({
        type: z.literal('AINNTEKT'),
    }),
    z.object({
        type: z.literal('SKJONNSFASTSETTELSE'),
        månedsbeløp: z.number(),
        årsak: arbeidstakerSkjønnsfastsettelseÅrsakSchema,
        begrunnelse: z.string(),
        refusjon: refusjonInfoSchema.optional(),
    }),
    z.object({
        type: z.literal('MANUELLT_BEREGNET'),
        månedsbeløp: z.number(),
        begrunnelse: z.string(),
    }),
])

// Pensjonsgivende inntekt typer (for selvstendig næringsdrivende og inaktiv)
export const pensjonsgivendeSkjønnsfastsettelseÅrsakSchema = z.enum([
    'AVVIK_25_PROSENT_VARIG_ENDRING',
    'SISTE_TRE_YRKESAKTIV',
])

export const pensjonsgivendeInntektRequestSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('PENSJONSGIVENDE_INNTEKT'),
    }),
    z.object({
        type: z.literal('SKJONNSFASTSETTELSE'),
        årsinntekt: z.number(),
        årsak: pensjonsgivendeSkjønnsfastsettelseÅrsakSchema,
        begrunnelse: z.string(),
    }),
])

// Frilanser inntekt typer
export const frilanserSkjønnsfastsettelseÅrsakSchema = z.enum(['AVVIK_25_PROSENT', 'MANGFULL_RAPPORTERING'])

export const frilanserInntektRequestSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('AINNTEKT'),
    }),
    z.object({
        type: z.literal('SKJONNSFASTSETTELSE'),
        månedsbeløp: z.number(),
        årsak: frilanserSkjønnsfastsettelseÅrsakSchema,
        begrunnelse: z.string(),
    }),
])

// Arbeidsledig inntekt typer
export const arbeidsledigInntektTypeSchema = z.enum(['DAGPENGER', 'VENTELONN', 'VARTPENGER'])

export const arbeidsledigInntektRequestSchema = z.object({
    type: arbeidsledigInntektTypeSchema,
    månedligBeløp: z.number(),
})

// Hovedunion for alle inntekt requests
export const inntektRequestSchema = z.discriminatedUnion('inntektskategori', [
    z.object({
        inntektskategori: z.literal('ARBEIDSTAKER'),
        data: arbeidstakerInntektRequestSchema,
    }),
    z.object({
        inntektskategori: z.literal('SELVSTENDIG_NÆRINGSDRIVENDE'),
        data: pensjonsgivendeInntektRequestSchema,
    }),
    z.object({
        inntektskategori: z.literal('INAKTIV'),
        data: pensjonsgivendeInntektRequestSchema,
    }),
    z.object({
        inntektskategori: z.literal('FRILANSER'),
        data: frilanserInntektRequestSchema,
    }),
    z.object({
        inntektskategori: z.literal('ARBEIDSLEDIG'),
        data: arbeidsledigInntektRequestSchema,
    }),
])

// Type exports
export type InntektRequest = z.infer<typeof inntektRequestSchema>
export type ArbeidstakerInntektRequest = z.infer<typeof arbeidstakerInntektRequestSchema>
export type PensjonsgivendeInntektRequest = z.infer<typeof pensjonsgivendeInntektRequestSchema>
export type FrilanserInntektRequest = z.infer<typeof frilanserInntektRequestSchema>
export type ArbeidsledigInntektRequest = z.infer<typeof arbeidsledigInntektRequestSchema>
export type ArbeidstakerSkjønnsfastsettelseÅrsak = z.infer<typeof arbeidstakerSkjønnsfastsettelseÅrsakSchema>
export type PensjonsgivendeSkjønnsfastsettelseÅrsak = z.infer<typeof pensjonsgivendeSkjønnsfastsettelseÅrsakSchema>
export type FrilanserSkjønnsfastsettelseÅrsak = z.infer<typeof frilanserSkjønnsfastsettelseÅrsakSchema>
export type ArbeidsledigInntektType = z.infer<typeof arbeidsledigInntektTypeSchema>
