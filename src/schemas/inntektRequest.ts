import { z } from 'zod/v4'
import dayjs from 'dayjs'

import { getFormattedDateString } from '@utils/date-format'

// Hjelpeklasser
export const refusjonInfoSchema = z
    .object({
        fom: z.iso.date({ error: 'Fra og med dato må være fylt ut og være en gyldig dato' }),
        tom: z.iso.date().nullable(), // LocalDate som string
        beløp: z.number({ error: 'Refusjonsbeløp må være et tall' }),
    })
    .superRefine(({ fom, tom }, ctx) => {
        const fomDate = dayjs(fom)

        if (tom) {
            const tomDate = dayjs(tom)
            if (fomDate.isValid() && tomDate.isValid() && tomDate.isSameOrBefore(fomDate)) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['tom'],
                    message: 'Til-dato må være etter fra-dato',
                })
            }
        }
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
    'DEFAULT',
])

export const arbeidstakerInntektRequestSchema = z
    .discriminatedUnion('type', [
        z
            .object({
                type: arbeidstakerInntektTypeSchema.extract(['DEFAULT']),
                årsinntekt: z.number(),
            })
            .superRefine((_, ctx) => {
                ctx.addIssue({
                    code: 'custom',
                    path: ['type'],
                    message: 'Du må velge en kilde',
                })
            }),
        z.object({
            type: arbeidstakerInntektTypeSchema.extract(['INNTEKTSMELDING']),
            inntektsmeldingId: z.string().min(1, { message: 'Du må velge en inntektsmelding' }),
        }),
        z.object({
            type: arbeidstakerInntektTypeSchema.extract(['AINNTEKT']),
        }),
        z.object({
            type: arbeidstakerInntektTypeSchema.extract(['SKJONNSFASTSETTELSE']),
            årsinntekt: z.number({ error: 'Årsinntekt må være et tall' }),
            årsak: arbeidstakerSkjønnsfastsettelseÅrsakSchema,
        }),
        z.object({
            type: arbeidstakerInntektTypeSchema.extract(['MANUELT_BEREGNET']),
            årsinntekt: z.number({ error: 'Årsinntekt må være et tall' }),
        }),
    ])
    .and(
        z
            .object({
                begrunnelse: z.string(),
                refusjon: z.array(refusjonInfoSchema).optional(),
            })
            .superRefine(({ refusjon }, ctx) => {
                if (!refusjon) return

                const sorted = [...refusjon].sort((a, b) => dayjs(a.fom).diff(dayjs(b.fom)))

                sorted.slice(0, -1).forEach((current, i) => {
                    const next = sorted[i + 1]

                    if (!current.tom) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['refusjon', i, 'tom'],
                            message: 'Du må fylle ut t.o.m dato når det finnes senere perioder',
                        })
                        return
                    }

                    const currentTom = dayjs(current.tom)
                    const nextFom = dayjs(next.fom)

                    // must start next day
                    const expectedNextFom = currentTom.add(1, 'day')
                    if (!nextFom.isSame(expectedNextFom, 'day')) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['refusjon', i + 1, 'fom'],
                            message: `Perioden må starte dagen etter forrige periodes t.o.m dato (${getFormattedDateString(
                                current.tom,
                            )})`,
                        })
                    }
                })
            }),
    )

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
            årsinntekt: z.number({ error: 'Årsinntekt må være et tall' }),
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
            årsinntekt: z.number({ error: 'Årsinntekt må være et tall' }),
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
            dagbeløp: z.number({ error: 'Dagbeløp må være et tall' }),
        }),
        z.object({
            type: arbeidsledigInntektTypeSchema.extract(['VENTELONN']),
            årsinntekt: z.number({ error: 'Årsinntekt må være et tall' }),
        }),
        z.object({
            type: arbeidsledigInntektTypeSchema.extract(['VARTPENGER']),
            årsinntekt: z.number({ error: 'Årsinntekt må være et tall' }),
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
