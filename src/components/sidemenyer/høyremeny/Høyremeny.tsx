'use client'

import { ReactElement, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
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
        <HStack wrap={false}>
            <AnimatePresence initial={false}>
                {showSidemeny && (
                    <motion.div
                        key="høyremeny"
                        transition={{
                            type: 'tween',
                            duration: 0.2,
                            ease: 'easeInOut',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: 'auto' }}
                        exit={{ width: 0 }}
                        className="overflow-hidden"
                    >
                        <Sidemeny side="right" className="h-full">
                            <VStack gap="4">
                                <Heading level="1" size="xsmall" className="font-medium text-gray-600">
                                    {filter}
                                </Heading>
                                {høyremenyElementer[filter]}
                            </VStack>
                        </Sidemeny>
                    </motion.div>
                )}
            </AnimatePresence>
            <VStack className="border-l-1 border-border-divider px-3 py-6" gap="6">
                <FilterButton
                    icon={<ClockIcon title="Historikk" />}
                    active={filter === 'Historikk' && showSidemeny}
                    onClick={() => handleClick('Historikk')}
                />
                <FilterButton
                    icon={<FolderIcon title="Dokumenter" />}
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
                'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full active:bg-surface-action active:text-text-on-action',
                {
                    'bg-surface-subtle hover:bg-surface-action-subtle-hover': !active,
                    'bg-surface-action text-text-on-action hover:bg-surface-action-hover': active,
                },
            )}
            onClick={onClick}
        >
            {icon}
        </button>
    )
}
