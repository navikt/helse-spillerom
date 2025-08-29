import { z } from 'zod/v4'

export const inntektskildeSchema = z.enum(
    ['AINNTEKT', 'INNTEKTSMELDING', 'PENSJONSGIVENDE_INNTEKT', 'SKJONNSFASTSETTELSE'],
    { error: 'Dette valget er ikke en del av schema. Kontakt en utvikler' },
)
export type Inntektskilde = z.infer<typeof inntektskildeSchema>

export const refusjonsperiodeSchema = z
    .object({
        fom: z.iso.date({ error: 'Må være fylt ut og være en gyldig dato' }), // ISO 8601 date string
        tom: z.string(), // ISO 8601 date string
        beløpØre: z.number({ error: 'Refusjonsbeløp må være et tall' }).int().min(0), // Beløp i øre
    })
    .superRefine((data, ctx) => {
        const fomDate = new Date(data.fom)
        const tomDate = new Date(data.tom)

        if (!isNaN(fomDate.getTime()) && !isNaN(tomDate.getTime()) && fomDate > tomDate) {
            ctx.addIssue({
                code: 'custom',
                path: ['fom'],
                message: 'Fra-dato kan ikke være etter til-dato',
            })
        }
    })
export type Refusjonsperiode = z.infer<typeof refusjonsperiodeSchema>

export const inntektSchema = z.object({
    yrkesaktivitetId: z.string(),
    beløpPerMånedØre: z.number({ error: 'Inntekt må være et tall' }).int().min(0), // Beløp i øre
    kilde: inntektskildeSchema,
    refusjon: z.array(refusjonsperiodeSchema).optional(),
})
export type Inntekt = z.infer<typeof inntektSchema>

export const sykepengegrunnlagRequestSchema = z.object({
    inntekter: z.array(inntektSchema).min(1, 'Må ha minst én inntekt'),
    begrunnelse: z.string().max(1000, { error: 'Maks 1000 tegn i begrunnelsen' }).nullable().optional(),
})
export type SykepengegrunnlagRequest = z.infer<typeof sykepengegrunnlagRequestSchema>

export const sykepengegrunnlagResponseSchema = z
    .object({
        id: z.string(),
        saksbehandlingsperiodeId: z.string(),
        inntekter: z.array(inntektSchema),
        totalInntektØre: z.number().int().min(0), // Årsinntekt i øre
        grunnbeløpØre: z.number().int().min(0), // 1G i øre
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
export function kronerTilØrer(kroner: number | string): number {
    return Math.round(Number(String(kroner).replace(',', '.')) * 100)
}

export function ørerTilKroner(ører: number): number {
    return ører / 100
}

export function øreTilDisplay(øre?: number): string {
    return øre == null ? '' : String(øre / 100).replace('.', ',')
}

export function formaterBeløpØre(ører: number | undefined, desimaler: number = 2): string {
    if (ører === undefined) return '-'
    return new Intl.NumberFormat('nb-NO', {
        style: 'currency',
        currency: 'NOK',
        minimumFractionDigits: desimaler,
        maximumFractionDigits: desimaler,
    }).format(ørerTilKroner(ører))
}
