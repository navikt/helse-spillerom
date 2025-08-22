'use client'

import React, { ReactElement } from 'react'
import { Table } from '@navikt/ds-react'

import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'

export function InntektsforholdDebug(): ReactElement {
    const { data: inntektsforhold = [] } = useInntektsforhold()

    return (
        <div className="space-y-6">
            {inntektsforhold.map((forhold, index) => (
                <div key={forhold.id} className="rounded-lg border border-ax-border-neutral-subtle p-4">
                    <div className="mb-3 border-b border-ax-border-neutral-subtle pb-2">
                        <h3 className="text-gray-700 text-sm font-semibold">Yrkesaktivitet #{index + 1}</h3>
                    </div>
                    <Table>
                        <Table.Body>
                            {Object.entries(forhold.kategorisering).map(([key, value]) => (
                                <Table.Row key={`${forhold.id}-${key}`}>
                                    <Table.DataCell>
                                        <div className="text-sm font-medium">{key}</div>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <div className="text-sm">{Array.isArray(value) ? value.join(', ') : value}</div>
                                    </Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            ))}
        </div>
    )
}
