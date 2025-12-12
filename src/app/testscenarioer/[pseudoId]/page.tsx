'use client'

import { ReactElement, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heading, BodyShort } from '@navikt/ds-react'

import { erDevLokalEllerDemo } from '@/env'
import { useScenarioer } from '@/hooks/queries/useScenarioer'
import { TestscenarioDetaljer } from '@/components/testdata/TestscenarioDetaljer'
import { usePersonRouteParams } from '@hooks/useRouteParams'

export default function TestscenarioDetaljerPage(): ReactElement {
    const router = useRouter()
    const { pseudoId } = usePersonRouteParams()
    const { data: scenarioer, isLoading, isError } = useScenarioer()

    useEffect(() => {
        if (!erDevLokalEllerDemo) {
            router.push('/404')
        }
    }, [router])

    if (!erDevLokalEllerDemo) {
        return (
            <section className="flex-auto p-8">
                <div>Side ikke tilgjengelig</div>
            </section>
        )
    }

    if (isLoading) {
        return (
            <section className="flex-auto p-8">
                <div>Laster...</div>
            </section>
        )
    }

    if (isError || !scenarioer) {
        return (
            <section className="flex-auto p-8">
                <div>Kunne ikke laste scenarier</div>
            </section>
        )
    }

    const scenario = scenarioer.find((s) => s.testperson.spilleromId === pseudoId)
    //debugger
    if (!scenario) {
        return (
            <section className="flex-auto p-8">
                <Heading level="1" size="large" className="mb-4">
                    Scenario ikke funnet
                </Heading>
                <BodyShort>Fant ikke scenario for pseudoId: {pseudoId}</BodyShort>
            </section>
        )
    }

    return (
        <section className="flex-auto p-8">
            <TestscenarioDetaljer scenario={scenario} />
        </section>
    )
}
