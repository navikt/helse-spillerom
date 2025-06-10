'use client'

import { ReactElement, useState } from 'react'
import { Heading, HStack, VStack } from '@navikt/ds-react'
import { ClockIcon, FolderIcon } from '@navikt/aksel-icons'

import { Sidemeny } from '@components/sidemenyer/Sidemeny'
import { Dokumenter } from '@components/sidemenyer/høyremeny/dokumenter/Dokumenter'
import { AaregKnapp } from '@components/sidemenyer/høyremeny/dokumenter/AaregKnapp'
import { AinntektKnapp } from '@components/sidemenyer/høyremeny/dokumenter/AinntektKnapp'
import { cn } from '@utils/tw'
import { Historikk } from '@components/sidemenyer/høyremeny/historikk/Historikk'

type HøyremenyFilter = 'Historikk' | 'Dokumenter'

export function Høyremeny(): ReactElement {
    const [filter, setFilter] = useState<HøyremenyFilter>('Dokumenter')
    const [showSidemeny, setShowSidemeny] = useState<boolean>(true)

    function handleClick(clickedFilter: HøyremenyFilter) {
        if (filter === clickedFilter && showSidemeny) {
            setShowSidemeny(false)
        } else {
            setShowSidemeny(true)
            setFilter(clickedFilter)
        }
    }

    return (
        <HStack>
            {showSidemeny && (
                <Sidemeny side="right" className="transition delay-150 duration-300 ease-in-out">
                    <VStack gap="4">
                        <Heading level="1" size="xsmall" className="font-medium text-gray-600">
                            {filter}
                        </Heading>
                        {høyremenyElementer[filter]}
                    </VStack>
                </Sidemeny>
            )}
            <VStack className="border-l-1 border-border-divider px-3 py-6" gap="6">
                <FilterButton
                    icon={<ClockIcon />}
                    active={filter === 'Historikk' && showSidemeny}
                    onClick={() => handleClick('Historikk')}
                />
                <FilterButton
                    icon={<FolderIcon />}
                    active={filter === 'Dokumenter' && showSidemeny}
                    onClick={() => handleClick('Dokumenter')}
                />
            </VStack>
        </HStack>
    )
}

const høyremenyElementer: Record<HøyremenyFilter, ReactElement> = {
    Dokumenter: (
        <>
            <Dokumenter />
            <AaregKnapp />
            <AinntektKnapp />
        </>
    ),
    Historikk: <Historikk />,
}

interface FilterButtonProps {
    icon: ReactElement
    active: boolean
    onClick: () => void
}

function FilterButton({ icon, active, onClick }: FilterButtonProps): ReactElement {
    return (
        <button
            className={cn(
                'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface-subtle hover:bg-surface-action-subtle-hover active:bg-surface-action active:text-text-on-action',
                {
                    'bg-surface-action text-text-on-action': active,
                },
            )}
            onClick={onClick}
        >
            {icon}
        </button>
    )
}
