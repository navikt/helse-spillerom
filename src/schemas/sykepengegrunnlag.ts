import { z } from 'zod/v4'

export const inntektskildeSchema = z.enum(['AINNTEKT', 'SAKSBEHANDLER', 'SKJONNSFASTSETTELSE'])
export type Inntektskilde = z.infer<typeof inntektskildeSchema>

export const refusjonsperiodeSchema = z
    .object({
        fom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Må være gyldig dato format YYYY-MM-DD'),
        tom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Må være gyldig dato format YYYY-MM-DD'),
        beløpØre: z.number().int().min(0), // Beløp i øre
    })
    .refine((data) => new Date(data.fom) <= new Date(data.tom), {
        message: 'Fra-dato må være før eller lik til-dato',
        path: ['fom'],
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
    inntekter: z.array(inntektSchema),
    begrunnelse: z.string().nullable().optional(),
})
export type SykepengegrunnlagRequest = z.infer<typeof sykepengegrunnlagRequestSchema>

export const sykepengegrunnlagResponseSchema = z.object({
    id: z.string(),
    saksbehandlingsperiodeId: z.string(),
    inntekter: z.array(inntektSchema),
    totalInntektØre: z.number().int().min(0), // Årsinntekt i øre
    grunnbeløp6GØre: z.number().int().min(0), // 6G i øre
    begrensetTil6G: z.boolean(),
    sykepengegrunnlagØre: z.number().int().min(0), // Endelig grunnlag i øre
    begrunnelse: z.string().nullable().optional(),
    opprettet: z.string(),
    opprettetAv: z.string(),
    sistOppdatert: z.string(),
})
export type SykepengegrunnlagResponse = z.infer<typeof sykepengegrunnlagResponseSchema>

// Hjelpefunksjoner for å konvertere mellom øre og kroner
export const ørerTilKroner = (øre: number): number => øre / 100
export const kronerTilØrer = (kroner: number): number => Math.round(kroner * 100)

// Formatering for visning
export const formaterBeløpØre = (øre: number): string => {
    return new Intl.NumberFormat('nb-NO', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(ørerTilKroner(øre))
}
