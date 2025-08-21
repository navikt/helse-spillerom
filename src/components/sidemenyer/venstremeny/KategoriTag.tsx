'use client'

import { Tag } from '@navikt/ds-react'
import { ReactElement } from 'react'

import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'

import { getKategorierFraInntektsforhold, kategoriSetTilTekstOgWarning } from './kategoriUtils'

export function KategoriTag(): ReactElement | null {
    const { data: inntektsforhold } = useInntektsforhold()
    if (!inntektsforhold) return null
    const kategorier = getKategorierFraInntektsforhold(inntektsforhold)
    const { tekst: kategoriTekst, warning } = kategoriSetTilTekstOgWarning(kategorier)
    if (!kategoriTekst) return null
    return (
        <div role="region" aria-label="Inntektskategorier">
            <Tag
                variant={warning ? 'warning' : 'neutral'}
                size="medium"
                aria-label={warning ? `Advarsel: ${kategoriTekst}` : kategoriTekst}
            >
                {kategoriTekst}
            </Tag>
        </div>
    )
}
