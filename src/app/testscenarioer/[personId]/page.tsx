'use client'

import { ReactElement, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Heading, BodyShort } from '@navikt/ds-react'

import { erDevLokalEllerDemo } from '@/env'
import { useScenarioer } from '@/hooks/queries/useScenarioer'
import { TestscenarioDetaljer } from '@/components/testdata/TestscenarioDetaljer'

export default function TestscenarioDetaljerPage(): ReactElement {
    const router = useRouter()
    const params = useParams()
    const personId = params.personId as string
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

    const scenario = scenarioer.find((s) => s.testperson.spilleromId === personId)

    if (!scenario) {
        return (
            <section className="flex-auto p-8">
                <Heading level="1" size="large" className="mb-4">
                    Scenario ikke funnet
                </Heading>
                <BodyShort>Fant ikke scenario for personId: {personId}</BodyShort>
            </section>
        )
    }

    return (
        <section className="flex-auto p-8">
            <TestscenarioDetaljer scenario={scenario} />
        </section>
    )
}
