import { z } from 'zod/v4'

// TypeArbeidstaker
export const typeArbeidstakerSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('ORDINÆR'),
        orgnummer: z.string(),
    }),
    z.object({
        type: z.literal('MARITIM'),
        orgnummer: z.string(),
    }),
    z.object({
        type: z.literal('FISKER'),
        orgnummer: z.string(),
    }),
    z.object({
        type: z.literal('DIMMITERT_VERNEPLIKTIG'),
    }),
    z.object({
        type: z.literal('PRIVAT_ARBEIDSGIVER'),
        arbeidsgiverFnr: z.string(),
    }),
])

export const frilanserForsikringSchema = z.enum(['FORSIKRING_100_PROSENT_FRA_FØRSTE_SYKEDAG', 'INGEN_FORSIKRING'])

export const selvstendigForsikringSchema = z.enum([
    'FORSIKRING_80_PROSENT_FRA_FØRSTE_SYKEDAG',
    'FORSIKRING_100_PROSENT_FRA_17_SYKEDAG',
    'FORSIKRING_100_PROSENT_FRA_FØRSTE_SYKEDAG',
    'INGEN_FORSIKRING',
])

export const variantAvInaktivSchema = z.enum(['INAKTIV_VARIANT_A', 'INAKTIV_VARIANT_B'])

// TypeSelvstendigNæringsdrivende
export const typeSelvstendigNæringsdrivendeSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('ORDINÆR'),
        forsikring: selvstendigForsikringSchema,
    }),
    z.object({
        type: z.literal('BARNEPASSER_EGET_HJEM'),
        forsikring: selvstendigForsikringSchema,
    }),
    z.object({
        type: z.literal('FISKER'),
        forsikring: z.literal('FORSIKRING_100_PROSENT_FRA_FØRSTE_SYKEDAG'),
    }),
    z.object({
        type: z.literal('JORDBRUKER'),
        forsikring: selvstendigForsikringSchema,
    }),
    z.object({
        type: z.literal('REINDRIFT'),
        forsikring: selvstendigForsikringSchema,
    }),
])

// YrkesaktivitetKategorisering
export const yrkesaktivitetKategoriseringSchema = z.discriminatedUnion('inntektskategori', [
    z.object({
        inntektskategori: z.literal('ARBEIDSTAKER'),
        sykmeldt: z.boolean(),
        typeArbeidstaker: typeArbeidstakerSchema,
    }),
    z.object({
        inntektskategori: z.literal('FRILANSER'),
        sykmeldt: z.boolean(),
        orgnummer: z.string(),
        forsikring: frilanserForsikringSchema,
    }),
    z.object({
        inntektskategori: z.literal('SELVSTENDIG_NÆRINGSDRIVENDE'),
        sykmeldt: z.boolean(),
        typeSelvstendigNæringsdrivende: typeSelvstendigNæringsdrivendeSchema,
    }),
    z.object({
        inntektskategori: z.literal('INAKTIV'),
        sykmeldt: z.literal(true),
        variant: variantAvInaktivSchema,
    }),
    z.object({
        inntektskategori: z.literal('ARBEIDSLEDIG'),
        sykmeldt: z.literal(true),
    }),
])

export type YrkesaktivitetKategorisering = z.infer<typeof yrkesaktivitetKategoriseringSchema>
export type TypeArbeidstaker = z.infer<typeof typeArbeidstakerSchema>
export type FrilanserForsikring = z.infer<typeof frilanserForsikringSchema>
export type SelvstendigForsikring = z.infer<typeof selvstendigForsikringSchema>
export type TypeSelvstendigNæringsdrivende = z.infer<typeof typeSelvstendigNæringsdrivendeSchema>
export type VariantAvInaktiv = z.infer<typeof variantAvInaktivSchema>

/**
 * Henter orgnummer fra YrkesaktivitetKategorisering hvis det finnes
 * Tilsvarer maybeOrgnummer() i Kotlin
 */
export function maybeOrgnummer(kategorisering: YrkesaktivitetKategorisering): string | null {
    if (kategorisering.inntektskategori === 'ARBEIDSTAKER') {
        const type = kategorisering.typeArbeidstaker
        if (type.type === 'ORDINÆR' || type.type === 'MARITIM' || type.type === 'FISKER') {
            return type.orgnummer
        }
        return null
    }
    if (kategorisering.inntektskategori === 'FRILANSER') {
        return kategorisering.orgnummer
    }
    return null
}

/**
 * Henter orgnummer fra YrkesaktivitetKategorisering
 * Kaster feil hvis orgnummer ikke finnes
 * Tilsvarer orgnummer() i Kotlin
 */
export function orgnummer(kategorisering: YrkesaktivitetKategorisering): string {
    const maybe = maybeOrgnummer(kategorisering)
    if (maybe === null) {
        throw new Error(`YrkesaktivitetKategorisering har ikke orgnummer. ${kategorisering.inntektskategori}`)
    }
    return maybe
}
