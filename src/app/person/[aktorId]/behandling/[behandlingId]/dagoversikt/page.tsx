'use client'

import React, { ReactElement, useEffect } from 'react'
import { Tabs } from '@navikt/ds-react'

import { useInntekter } from '@hooks/queries/useInntekter'
import { Utbetalingstabell } from '@components/dagoversikt/Utbetalingstabell'

export default function Page(): ReactElement {
    const { data: inntekter } = useInntekter()

    const [valgtTab, setValgtTab] = React.useState<string | undefined>(undefined)
    useEffect(() => {
        if (!valgtTab) {
            if (inntekter && inntekter.length > 0) {
                setValgtTab(inntekter[0].id)
            }
        }
    }, [inntekter, valgtTab])

    if (!inntekter) {
        return <div />
    }

    return (
        <Tabs value={valgtTab}>
            <Tabs.List>
                {inntekter
                    .filter((a) => a.sykmeldt)
                    .map((inntekt) => (
                        <Tabs.Tab
                            key={inntekt.id}
                            onClick={() => {
                                setValgtTab(inntekt.id)
                            }}
                            value={inntekt.id}
                            label={inntekt.orgnummer || inntekt.inntektstype}
                        />
                    ))}
            </Tabs.List>
            {inntekter
                .filter((a) => a.sykmeldt)
                .map((inntekt) => {
                    return (
                        <Tabs.Panel key={inntekt.id + 'panel'} value={inntekt.id}>
                            <Utbetalingstabell inntekt={inntekt}></Utbetalingstabell>
                        </Tabs.Panel>
                    )
                })}
        </Tabs>
    )
}
