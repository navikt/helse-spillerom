'use client'

import React, { ReactElement } from 'react'

import { useUtbetalingsberegning } from '@hooks/queries/useUtbetalingsberegning'

export function OppdragDebug(): ReactElement {
    const { data: utbetalingsberegning } = useUtbetalingsberegning()

    const oppdrag = utbetalingsberegning?.beregningData?.spilleromOppdrag?.oppdrag

    if (!oppdrag || oppdrag.length === 0) {
        return (
            <div className="p-4">
                <p className="text-gray-600">Ingen oppdrag funnet for denne saksbehandlingsperioden.</p>
            </div>
        )
    }

    return (
        <div className="p-4">
            <h3 className="mb-4 text-lg font-semibold">Oppdrag ({oppdrag.length})</h3>
            <div className="space-y-4">
                {oppdrag.map((oppdrag, index) => (
                    <div key={index} className="bg-gray-50 rounded border p-4">
                        <h4 className="mb-2 font-medium">Oppdrag {index + 1}</h4>
                        <pre className="bg-white overflow-auto rounded p-3 text-sm">
                            {JSON.stringify(oppdrag, null, 2)}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    )
}
