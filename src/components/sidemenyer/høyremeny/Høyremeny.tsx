'use client'

import { ReactElement, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { ClockIcon, FolderIcon, XMarkIcon } from '@navikt/aksel-icons'
import { useParams } from 'next/navigation'

import { Sidemeny } from '@components/sidemenyer/Sidemeny'
import { Dokumenter } from '@components/sidemenyer/høyremeny/dokumenter/Dokumenter'
import { ArbeidsforholdKnapp } from '@components/sidemenyer/høyremeny/dokumenter/ArbeidsforholdKnapp'
import { Ainntekt828Knapp } from '@components/sidemenyer/høyremeny/dokumenter/Ainntekt828Knapp'
import { PensjonsgivendeInntektKnapp } from '@components/sidemenyer/høyremeny/dokumenter/PensjonsgivendeInntektKnapp'
import { cn } from '@utils/tw'
import { Historikk } from '@components/sidemenyer/høyremeny/historikk/Historikk'
import { AnimatePresenceWrapper } from '@components/AnimatePresenceWrapper'
import { getTestSafeTransition } from '@utils/tsUtils'
import { Ainntekt830Knapp } from '@components/sidemenyer/høyremeny/dokumenter/Ainntekt830Knapp'
import { InntektTag } from '@components/ikoner/kilde/kildeTags'
import { useDokumentVisningContext } from '@/app/person/[personId]/dokumentVisningContext'
import { getFormattedDatetimeString } from '@utils/date-format'
import { InntektsmeldingInnhold } from '@components/sidemenyer/høyremeny/dokumenter/InntektsmeldingInnhold'

type HøyremenyFilter = 'Historikk' | 'Dokumenter'

export function Høyremeny(): ReactElement {
    const { dokumenter, updateDokumenter } = useDokumentVisningContext()

    const params = useParams()
    const erISaksbehandlingsperiode = Boolean(params?.saksbehandlingsperiodeId)

    const [internalFilter, setInternalFilter] = useState<HøyremenyFilter>(
        erISaksbehandlingsperiode ? 'Dokumenter' : 'Historikk',
    )
    const [showSidemeny, setShowSidemeny] = useState<boolean>(true)
    const showSidemenyRef = useRef(showSidemeny)

    // Hold ref oppdatert med gjeldende verdi
    useEffect(() => {
        showSidemenyRef.current = showSidemeny
    }, [showSidemeny])

    const filter = !erISaksbehandlingsperiode && internalFilter === 'Dokumenter' ? 'Historikk' : internalFilter

    // Lukk høyremeny automatisk ved resize under 1280px bredde
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 1280 && showSidemenyRef.current) {
                setShowSidemeny(false)
            }
        }

        window.addEventListener('resize', handleResize)

        // Sjekk også ved initial load
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    function handleClick(clickedFilter: HøyremenyFilter) {
        if (filter === clickedFilter && showSidemeny) {
            setShowSidemeny(false)
        } else {
            setShowSidemeny(true)
            setInternalFilter(clickedFilter)
        }
    }

    return (
        <HStack wrap={false} aria-label="Høyremeny kontroller">
            <AnimatePresenceWrapper initial={false}>
                {dokumenter.length > 0 &&
                    dokumenter.map((dokument) => (
                        <motion.div
                            key={dokument.inntektsmeldingId}
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
                            <Sidemeny
                                side="right"
                                className="h-full w-64 min-w-64 lg:w-64 lg:min-w-64 xl:w-64 xl:min-w-64"
                            >
                                <VStack gap="4">
                                    <HStack justify="space-between">
                                        <HStack gap="2" align="center">
                                            <span className="px-0.5">{InntektTag['INNTEKTSMELDING']}</span>
                                            <Heading level="1" size="xsmall" className="text-gray-600 font-medium">
                                                {getFormattedDatetimeString(dokument.mottattDato)}
                                            </Heading>
                                        </HStack>
                                        <Button
                                            variant="tertiary-neutral"
                                            size="xsmall"
                                            type="button"
                                            icon={<XMarkIcon aria-hidden />}
                                            onClick={() => updateDokumenter(dokument)}
                                            aria-label="Lukk høyremeny"
                                        />
                                    </HStack>
                                    <InntektsmeldingInnhold inntektsmelding={dokument} />
                                </VStack>
                            </Sidemeny>
                        </motion.div>
                    ))}
            </AnimatePresenceWrapper>
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
                                    <Heading level="1" size="xsmall" className="text-gray-600 font-medium">
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
                className="border-l-1 border-ax-border-neutral-subtle px-3 py-6"
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
                <Ainntekt828Knapp />
                <Ainntekt830Knapp />
                <ArbeidsforholdKnapp />
                <PensjonsgivendeInntektKnapp />
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
            className={cn('flex h-8 w-8 cursor-pointer items-center justify-center rounded-full', {
                'bg-ax-bg-accent-moderate hover:bg-ax-bg-accent-moderate-hover active:bg-ax-bg-accent-moderate-pressed':
                    !active,
                'bg-ax-bg-accent-strong text-ax-text-accent-contrast hover:bg-ax-bg-accent-strong-hover active:bg-ax-bg-accent-strong-pressed':
                    active,
            })}
            onClick={onClick}
            aria-label={label}
            aria-pressed={pressed}
            type="button"
        >
            {icon}
        </button>
    )
}
