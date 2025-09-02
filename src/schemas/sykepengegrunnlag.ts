import { z } from 'zod/v4'

import { getFormattedDateString } from '@utils/date-format'

export const inntektskildeSchema = z.enum(
    ['AINNTEKT', 'INNTEKTSMELDING', 'PENSJONSGIVENDE_INNTEKT', 'SKJONNSFASTSETTELSE'],
    { error: 'Dette valget er ikke en del av schema. Kontakt en utvikler' },
)
export type Inntektskilde = z.infer<typeof inntektskildeSchema>

export const refusjonsperiodeSchema = z
    .object({
        fom: z.iso.date({ error: 'Fra og med dato må være fylt ut og være en gyldig dato' }), // ISO 8601 date string
        tom: z.string().nullable(), // ISO 8601 date string eller null
        beløpØre: z.number({ error: 'Refusjonsbeløp må være et tall' }).int().min(0), // Beløp i øre
    })
    .superRefine((data, ctx) => {
        const fomDate = new Date(data.fom)

        // Kun valider tom-dato hvis den er satt
        if (data.tom) {
            const tomDate = new Date(data.tom)
            if (!isNaN(fomDate.getTime()) && !isNaN(tomDate.getTime()) && fomDate > tomDate) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['fom'],
                    message: 'Fra-dato kan ikke være etter til-dato',
                })
            }
        }
    })
export type Refusjonsperiode = z.infer<typeof refusjonsperiodeSchema>

export const inntektSchema = z
    .object({
        yrkesaktivitetId: z.string(),
        beløpPerMånedØre: z.number({ error: 'Inntekt må være et tall' }).int().min(0), // Beløp i øre
        kilde: inntektskildeSchema,
        refusjon: z.array(refusjonsperiodeSchema).optional(),
    })
    .superRefine((data, ctx) => {
        if (!data.refusjon) return

        const sorted = [...data.refusjon].sort((a, b) => +new Date(a.fom) - +new Date(b.fom))

        sorted.slice(0, -1).forEach((current, i) => {
            const next = sorted[i + 1]

            // Hopp over validering hvis current.tom er null (åpen periode)
            if (!current.tom) return

            const currentTom = new Date(current.tom)
            const nextFom = new Date(next.fom)

            if (+nextFom <= +currentTom) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['refusjon', i + 1, 'fom'],
                    message: `Perioden starter før eller på sluttdato (${getFormattedDateString(current.tom)}) til forrige periode`,
                })
                return
            }

            const expectedNextFom = new Date(+currentTom)
            expectedNextFom.setDate(expectedNextFom.getDate() + 1)

            if (+nextFom !== +expectedNextFom) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['refusjon', i + 1, 'fom'],
                    message: `Perioden må starte dagen etter forrige periodes t.o.m dato (${getFormattedDateString(current.tom)})`,
                })
            }
        })
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
