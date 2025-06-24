'use client'

import { ReactElement, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { ClockIcon, FolderIcon, XMarkIcon } from '@navikt/aksel-icons'
import { useParams } from 'next/navigation'

import { Sidemeny } from '@components/sidemenyer/Sidemeny'
import { Dokumenter } from '@components/sidemenyer/høyremeny/dokumenter/Dokumenter'
import { AaregKnapp } from '@components/sidemenyer/høyremeny/dokumenter/AaregKnapp'
import { AinntektKnapp } from '@components/sidemenyer/høyremeny/dokumenter/AinntektKnapp'
import { cn } from '@utils/tw'
import { Historikk } from '@components/sidemenyer/høyremeny/historikk/Historikk'
import { AnimatePresenceWrapper } from '@components/AnimatePresenceWrapper'
import { getTestSafeTransition } from '@utils/tsUtils'

type HøyremenyFilter = 'Historikk' | 'Dokumenter'

export function Høyremeny(): ReactElement {
    const params = useParams()
    const erISaksbehandlingsperiode = Boolean(params?.saksbehandlingsperiodeId)

    const [filter, setFilter] = useState<HøyremenyFilter>(erISaksbehandlingsperiode ? 'Dokumenter' : 'Historikk')
    const [showSidemeny, setShowSidemeny] = useState<boolean>(true)

    // Oppdater filter når vi navigerer til/fra saksbehandlingsperiode
    useEffect(() => {
        if (!erISaksbehandlingsperiode && filter === 'Dokumenter') {
            setFilter('Historikk')
        }
    }, [erISaksbehandlingsperiode, filter])

    function handleClick(clickedFilter: HøyremenyFilter) {
        if (filter === clickedFilter && showSidemeny) {
            setShowSidemeny(false)
        } else {
            setShowSidemeny(true)
            setFilter(clickedFilter)
        }
    }

    return (
        <HStack wrap={false} aria-label="Høyremeny kontroller">
            <AnimatePresenceWrapper initial={false}>
                {showSidemeny && (
                    <motion.div
                        key="høyremeny"
                        transition={getTestSafeTransition({
                            type: 'tween',
                            duration: 0.2,
                            ease: 'easeInOut',
                        })}
                        initial={{ width: 0 }}
                        animate={{ width: 'auto' }}
                        exit={{ width: 0 }}
                        className="overflow-hidden"
                    >
                        <Sidemeny side="right" className="h-full">
                            <VStack gap="4">
                                <HStack justify="space-between">
                                    <Heading level="1" size="xsmall" className="font-medium text-gray-600">
                                        {filter}
                                    </Heading>
                                    <Button
                                        variant="tertiary-neutral"
                                        size="xsmall"
                                        type="button"
                                        icon={<XMarkIcon aria-hidden />}
                                        onClick={() => setShowSidemeny(false)}
                                        aria-label="Lukk høyremeny"
                                    />
                                </HStack>
                                <div role="region" aria-label={`${filter.toLowerCase()} innhold`}>
                                    {høyremenyElementer[filter]}
                                </div>
                            </VStack>
                        </Sidemeny>
                    </motion.div>
                )}
            </AnimatePresenceWrapper>
            <VStack
                className="border-l-1 border-border-divider px-3 py-6"
                gap="6"
                role="toolbar"
                aria-label="Høyremeny navigasjon"
            >
                <FilterButton
                    icon={<ClockIcon aria-hidden />}
                    active={filter === 'Historikk' && showSidemeny}
                    onClick={() => handleClick('Historikk')}
                    label="Vis historikk"
                    pressed={filter === 'Historikk' && showSidemeny}
                />
                {erISaksbehandlingsperiode && (
                    <FilterButton
                        icon={<FolderIcon aria-hidden />}
                        active={filter === 'Dokumenter' && showSidemeny}
                        onClick={() => handleClick('Dokumenter')}
                        label="Vis dokumenter"
                        pressed={filter === 'Dokumenter' && showSidemeny}
                    />
                )}
            </VStack>
        </HStack>
    )
}

const høyremenyElementer: Record<HøyremenyFilter, ReactElement> = {
    Dokumenter: (
        <>
            <Dokumenter />
            <VStack gap="2" className="mt-4">
                <AaregKnapp />
                <AinntektKnapp />
            </VStack>
        </>
    ),
    Historikk: <Historikk />,
}

interface FilterButtonProps {
    icon: ReactElement
    active: boolean
    onClick: () => void
    label: string
    pressed: boolean
}

function FilterButton({ icon, active, onClick, label, pressed }: FilterButtonProps): ReactElement {
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
            aria-label={label}
            aria-pressed={pressed}
            type="button"
        >
            {icon}
        </button>
    )
}
