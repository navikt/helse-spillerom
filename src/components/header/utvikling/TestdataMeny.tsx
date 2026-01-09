'use client'

import React, { ReactElement, useState } from 'react'
import { ActionMenu, BodyShort, Detail, Tooltip } from '@navikt/ds-react'
import { InternalHeaderButton } from '@navikt/ds-react/InternalHeader'
import { useRouter } from 'next/navigation'
import { PersonGroupIcon } from '@navikt/aksel-icons'

import { useRegisterShortcutHandler } from '@components/tastatursnarveier/useRegisterShortcutHandler'
import { useTestpersoner } from '@hooks/queries/useTestpersoner'
import { useNullstillSession } from '@hooks/mutations/useNullstillSession'

export function TestdataMeny(): ReactElement {
    const [open, setOpen] = useState(false)

    useRegisterShortcutHandler('open_testdata', () => setOpen((prev) => !prev))

    return (
        <ActionMenu open={open} onOpenChange={setOpen}>
            <Tooltip content="Testpersoner">
                <ActionMenu.Trigger>
                    <InternalHeaderButton aria-label="Åpne testdataverktøy">
                        <PersonGroupIcon aria-hidden fontSize="1.5rem" />
                    </InternalHeaderButton>
                </ActionMenu.Trigger>
            </Tooltip>
            <TestdataMenyContent onClose={() => setOpen(false)} />
        </ActionMenu>
    )
}

function TestdataMenyContent({ onClose }: { onClose: () => void }): ReactElement {
    const router = useRouter()
    const testpersoner = useTestpersoner()
    const nullstillSession = useNullstillSession()

    const navigateTo = (path: string) => {
        onClose()
        router.push(path)
    }

    const testpersonerMedPersonId = testpersoner.data?.filter((p) => p.spilleromId !== null) ?? []

    const renderTestpersoner = () => {
        if (testpersoner.isLoading) {
            return (
                <BodyShort size="small" className="p-3">
                    Laster...
                </BodyShort>
            )
        }

        if (testpersoner.isError) {
            return (
                <BodyShort size="small" className="text-red-600 p-3">
                    Feil: {testpersoner.error?.message ?? 'Ukjent feil'}
                </BodyShort>
            )
        }

        if (testpersonerMedPersonId.length === 0) {
            return (
                <BodyShort size="small" className="p-3">
                    Ingen testpersoner tilgjengelig
                </BodyShort>
            )
        }

        return testpersonerMedPersonId.map((person) => (
            <ActionMenu.Item
                key={person.fnr}
                onSelect={() => navigateTo(`/person/${person.spilleromId}`)}
                className="mb-1 flex flex-col items-start gap-0"
            >
                <BodyShort size="small" as="span" weight="semibold">
                    {person.navn}
                </BodyShort>
                <Detail>{person.fnr}</Detail>
            </ActionMenu.Item>
        ))
    }

    return (
        <ActionMenu.Content className="min-w-[320px]">
            <ActionMenu.Group label="Verktøy">
                <ActionMenu.Item onSelect={() => navigateTo('/testscenarioer')}>Se testscenarier</ActionMenu.Item>
                <ActionMenu.Item onSelect={() => nullstillSession.mutate()}>Nullstill sesjon</ActionMenu.Item>
            </ActionMenu.Group>
            <ActionMenu.Divider />
            <ActionMenu.Group label="Testpersoner" className="max-h-[600px] overflow-y-auto">
                {renderTestpersoner()}
            </ActionMenu.Group>
        </ActionMenu.Content>
    )
}
