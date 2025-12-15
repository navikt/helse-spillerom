'use client'

import React, { ReactElement } from 'react'
import { LocalAlert, VStack } from '@navikt/ds-react'

import { useValideringer } from '@hooks/queries/useValideringer'

export function Valideringer(): ReactElement | null {
    const { data } = useValideringer()

    if (data == null || data.length === 0) return null

    return (
        <VStack gap="1" className="px-2 pt-1">
            {data.map((v) => {
                return (
                    <LocalAlert key={v.id} status="warning">
                        <LocalAlert.Header>
                            <LocalAlert.Title>{v.tekst}</LocalAlert.Title>
                            <LocalAlert.CloseButton
                                onClick={() => alert('Lukket validering. Ennå ikke implementert. God jul.')}
                            />
                        </LocalAlert.Header>
                    </LocalAlert>
                )
            })}
        </VStack>
    )
}
