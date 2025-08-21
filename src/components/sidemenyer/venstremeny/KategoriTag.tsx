'use client'

import { Tag } from '@navikt/ds-react'
import { ReactElement } from 'react'

import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'

import { getKategorierFraYrkesaktivitet, kategoriSetTilTekstOgWarning } from './kategoriUtils'

export function KategoriTag(): ReactElement | null {
    const { data: yrkesaktivitet } = useYrkesaktivitet()
    if (!yrkesaktivitet) return null
    const kategorier = getKategorierFraYrkesaktivitet(yrkesaktivitet)
    const { tekst: kategoriTekst, warning } = kategoriSetTilTekstOgWarning(kategorier)
    if (!kategoriTekst) return null
    return (
        <div role="region" aria-label="Yrkesaktivitetskategorier">
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
