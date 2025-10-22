import { z } from 'zod/v4'

// Hjelpeklasser
export const refusjonInfoSchema = z.object({
    fom: z.string(), // LocalDate som string
    tom: z.string().nullable(), // LocalDate som string
    beløp: z.number(),
})

export type RefusjonInfo = z.infer<typeof refusjonInfoSchema>

// Arbeidstaker inntekt typer
export const arbeidstakerSkjønnsfastsettelseÅrsakSchema = z.enum([
    'AVVIK_25_PROSENT',
    'MANGELFULL_RAPPORTERING',
    'TIDSAVGRENSET',
])

export const arbeidstakerInntektTypeSchema = z.enum([
    'INNTEKTSMELDING',
    'AINNTEKT',
    'SKJONNSFASTSETTELSE',
    'MANUELT_BEREGNET',
])

export const arbeidstakerInntektRequestSchema = z
    .discriminatedUnion('type', [
        z.object({
            type: arbeidstakerInntektTypeSchema.extract(['INNTEKTSMELDING']),
            inntektsmeldingId: z.string(),
        }),
        z.object({
            type: arbeidstakerInntektTypeSchema.extract(['AINNTEKT']),
        }),
        z.object({
            type: arbeidstakerInntektTypeSchema.extract(['SKJONNSFASTSETTELSE']),
            årsinntekt: z.number(),
            årsak: arbeidstakerSkjønnsfastsettelseÅrsakSchema,
        }),
        z.object({
            type: arbeidstakerInntektTypeSchema.extract(['MANUELT_BEREGNET']),
            årsinntekt: z.number(),
        }),
    ])
    .and(z.object({ begrunnelse: z.string(), refusjon: z.array(refusjonInfoSchema).optional() }))

// Pensjonsgivende inntekt typer (for selvstendig næringsdrivende og inaktiv)
export const pensjonsgivendeSkjønnsfastsettelseÅrsakSchema = z.enum([
    'AVVIK_25_PROSENT_VARIG_ENDRING',
    'SISTE_TRE_YRKESAKTIV',
])

export const pensjonsgivendeInntektTypeSchema = z.enum(['PENSJONSGIVENDE_INNTEKT', 'SKJONNSFASTSETTELSE'])

export const pensjonsgivendeInntektRequestSchema = z
    .discriminatedUnion('type', [
        z.object({
            type: pensjonsgivendeInntektTypeSchema.extract(['PENSJONSGIVENDE_INNTEKT']),
        }),
        z.object({
            type: pensjonsgivendeInntektTypeSchema.extract(['SKJONNSFASTSETTELSE']),
            årsinntekt: z.number(),
            årsak: pensjonsgivendeSkjønnsfastsettelseÅrsakSchema,
        }),
    ])
    .and(z.object({ begrunnelse: z.string() }))

// Frilanser inntekt typer
export const frilanserSkjønnsfastsettelseÅrsakSchema = z.enum(['AVVIK_25_PROSENT', 'MANGELFULL_RAPPORTERING'])

export const frilanserInntektTypeSchema = z.enum(['AINNTEKT', 'SKJONNSFASTSETTELSE'])

export const frilanserInntektRequestSchema = z
    .discriminatedUnion('type', [
        z.object({
            type: frilanserInntektTypeSchema.extract(['AINNTEKT']),
        }),
        z.object({
            type: frilanserInntektTypeSchema.extract(['SKJONNSFASTSETTELSE']),
            årsinntekt: z.number(),
            årsak: frilanserSkjønnsfastsettelseÅrsakSchema,
        }),
    ])
    .and(z.object({ begrunnelse: z.string() }))

// Arbeidsledig inntekt typer
export const arbeidsledigInntektTypeSchema = z.enum(['DAGPENGER', 'VENTELONN', 'VARTPENGER'])

export const arbeidsledigInntektRequestSchema = z
    .discriminatedUnion('type', [
        z.object({
            type: arbeidsledigInntektTypeSchema.extract(['DAGPENGER']),
            dagbeløp: z.number(),
        }),
        z.object({
            type: arbeidsledigInntektTypeSchema.extract(['VENTELONN']),
            årsinntekt: z.number(),
        }),
        z.object({
            type: arbeidsledigInntektTypeSchema.extract(['VARTPENGER']),
            årsinntekt: z.number(),
        }),
    ])
    .and(z.object({ begrunnelse: z.string() }))

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

export type Inntektskategori = InntektRequest['inntektskategori']
export type ArbeidstakerInntektType = z.infer<typeof arbeidstakerInntektTypeSchema>
export type PensjonsgivendeInntektType = z.infer<typeof pensjonsgivendeInntektTypeSchema>
export type FrilanserInntektType = z.infer<typeof frilanserInntektTypeSchema>
