import { PropsWithChildren, ReactElement } from 'react'
import { BodyShort, HStack, Skeleton, VStack } from '@navikt/ds-react'

import { getFormattedDatetimeString } from '@utils/date-format'
import { BehandlingEndring } from '@schemas/behandling'

interface HistorikkinnslagProps {
    historikkinnslag: BehandlingEndring
}

export function Historikkinnslag({ historikkinnslag }: HistorikkinnslagProps): ReactElement {
    return (
        <HistorikkinnslagContainer>
            <VStack gap="space-8">
                <VStack>
                    <BodyShort className="font-ax-bold">
                        {historikkinnslagVisningstekst[historikkinnslag.endringType]}
                    </BodyShort>
                    <BodyShort className="text-ax-medium text-ax-neutral-700">
                        {getFormattedDatetimeString(historikkinnslag.endretTidspunkt)} av{' '}
                        {historikkinnslag.endretAvNavIdent}
                    </BodyShort>
                </VStack>
                {historikkinnslag.endringKommentar && (
                    <BodyShort className="rounded border-l-4 border-l-ax-accent-600 bg-ax-neutral-100 p-3 text-ax-neutral-800">
                        {historikkinnslag.endringKommentar}
                    </BodyShort>
                )}
            </VStack>
        </HistorikkinnslagContainer>
    )
}

const historikkinnslagVisningstekst: Record<string, string> = {
    STARTET: 'Saksbehandling startet',
    SENDT_TIL_BESLUTNING: 'Sendt til beslutning',
    TATT_TIL_BESLUTNING: 'Tatt til beslutning',
    SENDT_I_RETUR: 'Sendt i retur',
    GODKJENT: 'Godkjent',
    OPPDATERT_INDIVIDUELL_BEGRUNNELSE: 'Oppdatert individuell begrunnelse',
    OPPDATERT_SKJÆRINGSTIDSPUNKT: 'Oppdatert skjæringstidspunkt',
    OPPDATERT_YRKESAKTIVITET_KATEGORISERING: 'Oppdatert yrkesaktivitet kategorisering',
    REVURDERING_STARTET: 'Revurdering startet',
}

export function HistorikkinnslagSkeleton(): ReactElement {
    return (
        <HistorikkinnslagContainer>
            <Skeleton width={24} height={30} />
            <VStack>
                <Skeleton width={180} className="text-lg" />
                <Skeleton width={130} className="text-ax-medium" />
            </VStack>
        </HistorikkinnslagContainer>
    )
}

function HistorikkinnslagContainer({ children }: PropsWithChildren): ReactElement {
    return (
        <HStack as="li" className="border-b-1 border-ax-border-neutral-subtle py-2" gap="space-8">
            {children}
        </HStack>
    )
}
