'use client'

import { Tag } from '@navikt/ds-react'
import { ReactElement } from 'react'

import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'

import { getKategorierFraInntektsforhold, kategoriSetTilTekstOgWarning } from './kategoriUtils'

export function KategoriTag(): ReactElement | null {
    const { data: yrkesaktivitet } = useYrkesaktivitet()
    if (!yrkesaktivitet) return null
    const kategorier = getKategorierFraInntektsforhold(yrkesaktivitet)
    const { tekst: kategoriTekst, warning } = kategoriSetTilTekstOgWarning(kategorier)
    if (!kategoriTekst) return null
    return (
        <Tag
            variant={warning ? 'warning' : 'neutral'}
            size="small"
            aria-label={warning ? `Advarsel: ${kategoriTekst}` : kategoriTekst}
        >
            {kategoriTekst}
        </Tag>
    )
}
