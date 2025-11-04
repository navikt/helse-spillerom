'use client'

import { ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { LinkCard, Heading } from '@navikt/ds-react'

import { Testscenario } from '@/schemas/testscenario'

interface TestscenarioListeProps {
    scenarioer: Testscenario[]
}

export function TestscenarioListe({ scenarioer }: TestscenarioListeProps): ReactElement {
    const router = useRouter()

    return (
        <>
            <Heading level="1" size="large" className="mb-6">
                Testscenarioer
            </Heading>
            <ul className="space-y-4">
                {scenarioer.map((scenario) => (
                    <li key={scenario.testperson.fnr}>
                        <LinkCard>
                            <LinkCard.Title>
                                <LinkCard.Anchor
                                    href={`/testscenarioer/${scenario.testperson.spilleromId}`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        router.push(`/testscenarioer/${scenario.testperson.spilleromId}`)
                                    }}
                                >
                                    {scenario.tittel}
                                </LinkCard.Anchor>
                            </LinkCard.Title>
                            <LinkCard.Description className="whitespace-pre-line">
                                {scenario.beskrivelse}
                            </LinkCard.Description>
                        </LinkCard>
                    </li>
                ))}
            </ul>
        </>
    )
}
