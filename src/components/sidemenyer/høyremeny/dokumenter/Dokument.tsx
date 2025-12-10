import { PropsWithChildren, ReactElement, useState } from 'react'
import { BodyShort, BoxNew, HStack, Skeleton, VStack } from '@navikt/ds-react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { motion } from 'motion/react'

import { Dokument as _Dokument, Dokumenttype } from '@schemas/dokument'
import { getFormattedDatetimeString } from '@utils/date-format'
import { SøknadsInnhold } from '@components/søknad/SøknadsInnhold'
import { Søknad } from '@schemas/søknad'
import { AnimatePresenceWrapper } from '@components/AnimatePresenceWrapper'
import { getTestSafeTransition } from '@utils/tsUtils'
import { AinntektVisning } from '@components/sidemenyer/høyremeny/dokumenter/AinntektVisning'
import { ArbeidsforholdVisning } from '@components/sidemenyer/høyremeny/dokumenter/ArbeidsforholdVisning'
import { PensjonsgivendeInntektVisning } from '@components/sidemenyer/høyremeny/dokumenter/PensjonsgivendeInntektVisning'
import { Ainntekt } from '@schemas/ainntekt'
import { Arbeidsforhold } from '@schemas/aareg'
import { PensjonsgivendeInntekt } from '@schemas/pensjonsgivende'
import { InntektsmeldingInnhold } from '@components/sidemenyer/høyremeny/dokumenter/InntektsmeldingInnhold'
import { Inntektsmelding } from '@schemas/inntektsmelding'
import { DokumentTag } from '@components/ikoner/kilde/kildeTags'
import { OpenDocumentInSidebarButton } from '@components/sidemenyer/høyremeny/dokumenter/OpenDocumentInSidebarButton'
import { DokumentSomKanVisesISidebar } from '@/app/person/[pseudoId]/dokumentVisningContext'

interface DokumentProps {
    dokument: _Dokument
}

export function Dokument({ dokument }: DokumentProps): ReactElement {
    const [open, setOpen] = useState(false)

    const toggleOpen = () => setOpen((prev) => !prev)

    return (
        <li className="border-b border-ax-border-neutral-subtle py-2">
            <HStack wrap={false} align="start">
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`dokument-innhold-${dokument.id}`}
                    onClick={toggleOpen}
                    className="flex w-full items-start gap-2 rounded border-0 bg-transparent px-0 text-left hover:cursor-pointer focus:outline-none focus-visible:ring"
                >
                    <span className="mt-0.5">{DokumentTag[dokument.dokumentType]}</span>
                    <VStack className="min-w-0 flex-1">
                        <BodyShort size="small" weight="semibold">
                            {dokumentVisningstekst[dokument.dokumentType]}
                        </BodyShort>
                        <BodyShort className="text-sm text-ax-text-neutral-subtle">
                            {getFormattedDatetimeString(dokument.opprettet)}
                        </BodyShort>
                    </VStack>
                    <span aria-hidden="true" className="ml-2">
                        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </span>
                </button>
                {(dokument.dokumentType === 'inntektsmelding' || dokument.dokumentType === 'søknad') && (
                    <OpenDocumentInSidebarButton
                        dokument={dokument.innhold as DokumentSomKanVisesISidebar}
                        showText={false}
                        className="ml-2"
                    />
                )}
            </HStack>
            <AnimatePresenceWrapper initial={false}>
                {open && (
                    <motion.div
                        id={`dokument-innhold-${dokument.id}`}
                        className="mt-2"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={getTestSafeTransition({ duration: 0.2, ease: 'easeInOut' })}
                        style={{ overflow: 'hidden' }}
                    >
                        {dokument.dokumentType === 'søknad' ? (
                            <BoxNew
                                background="raised"
                                borderRadius="large"
                                borderWidth="1"
                                borderColor="neutral-subtle"
                                className="flex flex-col gap-4 p-4"
                            >
                                <SøknadsInnhold søknad={dokument.innhold as Søknad} />
                            </BoxNew>
                        ) : ['ainntekt828', 'ainntekt830'].includes(dokument.dokumentType) ? (
                            <AinntektVisning ainntekt={dokument.innhold as Ainntekt} />
                        ) : dokument.dokumentType === 'arbeidsforhold' ? (
                            <ArbeidsforholdVisning arbeidsforhold={dokument.innhold as Arbeidsforhold[]} />
                        ) : dokument.dokumentType === 'pensjonsgivendeinntekt' ? (
                            <PensjonsgivendeInntektVisning
                                pensjonsgivendeInntekt={dokument.innhold as PensjonsgivendeInntekt}
                            />
                        ) : dokument.dokumentType === 'inntektsmelding' ? (
                            <BoxNew
                                background="raised"
                                borderRadius="large"
                                borderWidth="1"
                                borderColor="neutral-subtle"
                                className="flex flex-col gap-4 p-4"
                            >
                                <InntektsmeldingInnhold inntektsmelding={dokument.innhold as Inntektsmelding} />
                            </BoxNew>
                        ) : (
                            <pre className="bg-gray-50 overflow-x-auto rounded p-2 text-xs">
                                {JSON.stringify(dokument.innhold, null, 2)}
                            </pre>
                        )}
                    </motion.div>
                )}
            </AnimatePresenceWrapper>
        </li>
    )
}

const dokumentVisningstekst: Record<Dokumenttype, string> = {
    søknad: 'Søknad mottatt',
    inntektsmelding: 'Inntektsmelding mottatt',
    INNTEKTSMELDING: 'Inntektsmelding mottatt',
    SYKMELDING: 'Sykmelding mottatt',
    AAREG: 'Aa-reg',
    ainntekt828: 'A-inntekt 8-28',
    ainntekt830: 'A-inntekt 8-30',
    arbeidsforhold: 'Arbeidsforhold',
    pensjonsgivendeinntekt: 'Pensjonsgivende inntekt',
}

export function DokumentSkeleton(): ReactElement {
    return (
        <DokumentContainer>
            <Skeleton width={24} height={30} />
            <VStack>
                <Skeleton width={180} className="text-lg" />
                <Skeleton width={130} className="text-medium" />
            </VStack>
        </DokumentContainer>
    )
}

function DokumentContainer({ children }: PropsWithChildren): ReactElement {
    return (
        <HStack as="li" className="border-b border-ax-border-neutral-subtle py-2" gap="2">
            {children}
        </HStack>
    )
}
