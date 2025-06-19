'use client'

import { Tag } from '@navikt/ds-react'
import { ReactElement } from 'react'

import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import type { Inntektsforhold } from '@/schemas/inntektsforhold'

export function getKategorierFraInntektsforhold(inntektsforhold: Inntektsforhold[]): Set<string> {
    return new Set(
        inntektsforhold
            .map((forhold) => forhold.kategorisering['INNTEKTSKATEGORI'])
            .filter((kat): kat is string => Boolean(kat)),
    )
}

export function kategoriSetTilTekstOgWarning(kategorier: Set<string>): { tekst: string | null; warning: boolean } {
    if (kategorier.has('INAKTIV')) return { tekst: 'Inaktiv', warning: false }
    if (kategorier.has('ANNET')) return { tekst: 'Kategori ikke satt', warning: true }

    const hasArbeidstaker = kategorier.has('ARBEIDSTAKER')
    const hasSelvstendig = kategorier.has('SELVSTENDIG_NAERINGSDRIVENDE')
    const hasFrilanser = kategorier.has('FRILANSER')

    // 1 kategori
    if (hasArbeidstaker && !hasSelvstendig && !hasFrilanser) return { tekst: 'Arbeidstaker', warning: false }
    if (!hasArbeidstaker && hasSelvstendig && !hasFrilanser)
        return { tekst: 'Selvstendig næringsdrivende', warning: false }
    if (!hasArbeidstaker && !hasSelvstendig && hasFrilanser) return { tekst: 'Frilanser', warning: false }

    // 2 kategorier
    if (hasArbeidstaker && hasSelvstendig && !hasFrilanser)
        return { tekst: 'Arbeidstaker og selvstendig næringsdrivende', warning: false }
    if (hasArbeidstaker && !hasSelvstendig && hasFrilanser)
        return { tekst: 'Arbeidstaker og frilanser', warning: false }
    if (!hasArbeidstaker && hasSelvstendig && hasFrilanser)
        return { tekst: 'selvstendig næringsdrivende og frilanser', warning: false }

    // 3 kategorier
    if (hasArbeidstaker && hasSelvstendig && hasFrilanser)
        return { tekst: 'Arbeidstaker, selvstendig næringsdrivende og frilanser', warning: false }

    // Default fallback
    return { tekst: 'Kategori ikke satt', warning: true }
}

export function KategoriTag(): ReactElement | null {
    const { data: inntektsforhold } = useInntektsforhold()
    if (!inntektsforhold) return null
    const kategorier = getKategorierFraInntektsforhold(inntektsforhold)
    const { tekst: kategoriTekst, warning } = kategoriSetTilTekstOgWarning(kategorier)
    if (!kategoriTekst) return null
    return (
        <Tag variant={warning ? 'warning' : 'neutral'} size="medium">
            {kategoriTekst}
        </Tag>
    )
}
