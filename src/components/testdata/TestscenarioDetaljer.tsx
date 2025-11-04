'use client'

import { ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Heading, VStack, BodyShort } from '@navikt/ds-react'
import { ChevronRightDoubleIcon } from '@navikt/aksel-icons'

import { Testscenario } from '@/schemas/testscenario'

interface TestscenarioDetaljerProps {
    scenario: Testscenario
}

export function TestscenarioDetaljer({ scenario }: TestscenarioDetaljerProps): ReactElement {
    const router = useRouter()

    return (
        <VStack gap="6">
            <div>
                <Button
                    variant="tertiary"
                    onClick={() => {
                        router.push('/testscenarioer')
                    }}
                    className="mb-4"
                >
                    ← Tilbake til testscenarier
                </Button>
                <Heading level="1" size="large" className="mb-2">
                    {scenario.tittel}
                </Heading>
                <BodyShort className="mb-4 whitespace-pre-line">{scenario.beskrivelse}</BodyShort>
            </div>

            <div>
                <Heading level="2" size="medium" className="mb-2">
                    Testperson
                </Heading>
                <VStack gap="2">
                    <BodyShort>
                        <strong>Navn:</strong> {scenario.testperson.navn}
                    </BodyShort>
                    <BodyShort>
                        <strong>Fødselsnummer:</strong> {scenario.testperson.fnr}
                    </BodyShort>
                    <BodyShort>
                        <strong>Alder:</strong> {scenario.testperson.alder}
                    </BodyShort>
                </VStack>
            </div>

            <div>
                <Button
                    variant="primary"
                    onClick={() => {
                        router.push(`/person/${scenario.testperson.spilleromId}`)
                    }}
                    icon={<ChevronRightDoubleIcon />}
                >
                    Åpne i spillerom
                </Button>
            </div>
        </VStack>
    )
}
