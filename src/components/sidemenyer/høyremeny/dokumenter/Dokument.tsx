import { PropsWithChildren, ReactElement, useState } from 'react'
import { BodyShort, HStack, Skeleton, VStack } from '@navikt/ds-react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { motion } from 'motion/react'

import { Dokument as _Dokument, Dokumenttype } from '@schemas/dokument'
import { DokumentTag } from '@components/sidemenyer/høyremeny/dokumenter/DokumentTag'
import { getFormattedDatetimeString } from '@utils/date-format'
import { Søknadsinnhold } from '@components/søknad/Søknadsinnhold'
import { Søknad } from '@schemas/søknad'
import { AnimatePresenceWrapper } from '@components/AnimatePresenceWrapper'
import { getTestSafeTransition } from '@utils/tsUtils'

interface DokumentProps {
    dokument: _Dokument
}

export function Dokument({ dokument }: DokumentProps): ReactElement {
    const [open, setOpen] = useState(false)

    const toggleOpen = () => setOpen((prev) => !prev)

    return (
        <li className="border-b-1 border-border-divider py-2">
            <button
                type="button"
                aria-expanded={open}
                aria-controls={`dokument-innhold-${dokument.id}`}
                onClick={toggleOpen}
                className="flex w-full items-start gap-2 rounded border-0 bg-transparent px-0 text-left hover:cursor-pointer focus:outline-none focus-visible:ring"
            >
                <DokumentTag type={dokument.dokumentType} />
                <VStack className="min-w-0 flex-1">
                    <BodyShort className="font-bold">{dokumentVisningstekst[dokument.dokumentType]}</BodyShort>
                    <BodyShort className="text-medium text-gray-600">
                        {getFormattedDatetimeString(dokument.opprettet)}
                    </BodyShort>
                </VStack>
                <span aria-hidden="true" className="mt-1 ml-2">
                    {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </span>
            </button>
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
                        {dokument.dokumentType === 'SØKNAD' ? (
                            <Søknadsinnhold søknad={dokument.innhold as Søknad} />
                        ) : (
                            <pre className="overflow-x-auto rounded bg-gray-50 p-2 text-xs">
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
    SØKNAD: 'Søknad mottatt',
    INNTEKTSMELDING: 'Inntektsmelding mottatt',
    SYKMELDING: 'Sykmelding mottatt',
    AAREG: 'Aa-reg',
    ainntekt828: 'A-inntekt 828',
    arbeidsforhold: 'Arbeidsforhold',
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
        <HStack as="li" className="border-b-1 border-border-divider py-2" gap="2">
            {children}
        </HStack>
    )
}
