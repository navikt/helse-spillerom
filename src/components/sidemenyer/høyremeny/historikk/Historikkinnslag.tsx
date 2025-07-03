import { PropsWithChildren, ReactElement } from 'react'
import { BodyShort, HStack, Skeleton, VStack } from '@navikt/ds-react'

import { getFormattedDatetimeString } from '@utils/date-format'

interface HistorikkinnslagProps {
    historikkinnslag: string // Historikkinnslag
}

export function Historikkinnslag({ historikkinnslag }: HistorikkinnslagProps): ReactElement {
    return (
        <HistorikkinnslagContainer>
            <VStack>
                <BodyShort className="font-bold">{historikkinnslagVisningstekst[historikkinnslag]}</BodyShort>
                <BodyShort className="text-medium text-gray-600">
                    {getFormattedDatetimeString(historikkinnslag)}
                </BodyShort>
            </VStack>
        </HistorikkinnslagContainer>
    )
}

const historikkinnslagVisningstekst: Record<string, string> = {
    en_eller_annen_type: 'En eller annen visningstekst',
}

export function HistorikkinnslagSkeleton(): ReactElement {
    return (
        <HistorikkinnslagContainer>
            <Skeleton width={24} height={30} />
            <VStack>
                <Skeleton width={180} className="text-lg" />
                <Skeleton width={130} className="text-medium" />
            </VStack>
        </HistorikkinnslagContainer>
    )
}

function HistorikkinnslagContainer({ children }: PropsWithChildren): ReactElement {
    return (
        <HStack as="li" className="border-b-1 border-ax-border-neutral-subtle py-2" gap="2">
            {children}
        </HStack>
    )
}
