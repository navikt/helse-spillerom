import { PropsWithChildren, ReactElement } from 'react'
import { BodyShort, HStack, Skeleton, VStack } from '@navikt/ds-react'

import { Dokument as _Dokument, Dokumenttype } from '@schemas/dokument'
import { DokumentTag } from '@components/sidemenyer/høyremeny/dokumenter/DokumentTag'
import { getFormattedDatetimeString } from '@utils/date-format'

interface DokumentProps {
    dokument: _Dokument
}

export function Dokument({ dokument }: DokumentProps): ReactElement {
    return (
        <DokumentContainer>
            <DokumentTag type={dokument.dokumentType} />
            <VStack>
                <BodyShort className="font-bold">{dokumentVisningstekst[dokument.dokumentType]}</BodyShort>
                <BodyShort className="text-medium text-gray-600">
                    {getFormattedDatetimeString(dokument.opprettet)}
                </BodyShort>
            </VStack>
        </DokumentContainer>
    )
}

const dokumentVisningstekst: Record<Dokumenttype, string> = {
    SØKNAD: 'Søknad mottatt',
    INNTEKTSMELDING: 'Inntektsmelding mottatt',
    SYKMELDING: 'Sykmelding mottatt',
    AAREG: 'Aa-reg',
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
