'use client'

import { ReactElement, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heading, Button } from '@navikt/ds-react'

import { erDevLokalEllerDemo } from '@/env'
import { useScenarioer } from '@/hooks/queries/useScenarioer'
import { TestscenarioListe } from '@/components/testdata/TestscenarioListe'
import { useNullstillSession } from '@/hooks/mutations/useNullstillSession'

export default function TestscenarioerPage(): ReactElement {
    const router = useRouter()
    const { data: scenarioer, isLoading, isError } = useScenarioer()
    const nullstillSession = useNullstillSession()

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
                <Heading level="1" size="large" className="mb-4">
                    Testscenarioer
                </Heading>
                <div>Laster...</div>
            </section>
        )
    }

    if (isError || !scenarioer) {
        return (
            <section className="flex-auto p-8">
                <Heading level="1" size="large" className="mb-4">
                    Testscenarioer
                </Heading>
                <div>Kunne ikke laste scenarier</div>
            </section>
        )
    }

    return (
        <section className="flex-auto p-8">
            <div className="mb-4">
                <Button
                    variant="secondary"
                    onClick={() => nullstillSession.mutate()}
                    loading={nullstillSession.isPending}
                >
                    Nullstill session
                </Button>
            </div>
            <TestscenarioListe scenarioer={scenarioer} />
        </section>
    )
}
