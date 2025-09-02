'use client'

import { ReactElement } from 'react'
import { HStack, BodyShort } from '@navikt/ds-react'

import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'

import { beregnDekningsgradTiVenstremeny } from './kategoriUtils'

export function DekningsgradVisning(): ReactElement | null {
    const { data: yrkesaktivitet } = useYrkesaktivitet()

    if (!yrkesaktivitet) return null

    const dekningsgradInfo = beregnDekningsgradTiVenstremeny(yrkesaktivitet)
    if (!dekningsgradInfo) return null

    return (
        <HStack justify="space-between">
            <BodyShort size="small">{dekningsgradInfo.tekst}:</BodyShort>
            <BodyShort size="small">{dekningsgradInfo.tall}%</BodyShort>
        </HStack>
    )
}
