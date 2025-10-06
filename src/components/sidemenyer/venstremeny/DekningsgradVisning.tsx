'use client'

import { ReactElement } from 'react'
import { HStack, BodyShort } from '@navikt/ds-react'

import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { useUtbetalingsberegning } from '@hooks/queries/useUtbetalingsberegning'

import { beregnDekningsgradTiVenstremeny } from './kategoriUtils'

export function DekningsgradVisning(): ReactElement | null {
    const { data: yrkesaktivitet } = useYrkesaktivitet()
    const { data: utbetalingsberegning } = useUtbetalingsberegning()

    if (!yrkesaktivitet) return null
    if (!utbetalingsberegning) return null

    const yrkesaktivitetMedDekningsgrad = utbetalingsberegning.beregningData.yrkesaktiviteter
        .map((ya) => {
            const yrkesaktiviteten = yrkesaktivitet.find((y) => y.id === ya.yrkesaktivitetId)
            if (!yrkesaktiviteten) return null
            if (!ya.dekningsgrad) return null
            return { ...yrkesaktiviteten, dekningsgrad: ya.dekningsgrad.verdi.prosentDesimal }
        })
        .filter((ya): ya is NonNullable<typeof ya> => ya !== null)

    const dekningsgradInfo = beregnDekningsgradTiVenstremeny(yrkesaktivitetMedDekningsgrad)
    if (!dekningsgradInfo) return null

    return (
        <HStack justify="space-between">
            <BodyShort size="small">{dekningsgradInfo.tekst}:</BodyShort>
            <BodyShort size="small">{dekningsgradInfo.tall * 100}%</BodyShort>
        </HStack>
    )
}
