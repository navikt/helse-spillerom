'use client'

import React, { ReactElement } from 'react'
import { InfoCard, VStack } from '@navikt/ds-react'

import { useValideringer } from '@hooks/queries/useValideringer'

export function Valideringer(): ReactElement | null {
    const { data } = useValideringer()

    if (data == null || data.length === 0) return null

    return (
        <VStack gap="1" className="px-2 pt-1">
            {data.map((v) => {
                return (
                    <InfoCard size="small" key={v.id} data-color="warning">
                        <InfoCard.Header>
                            <InfoCard.Title>{v.tekst}</InfoCard.Title>
                        </InfoCard.Header>
                    </InfoCard>
                )
            })}
        </VStack>
    )
}
