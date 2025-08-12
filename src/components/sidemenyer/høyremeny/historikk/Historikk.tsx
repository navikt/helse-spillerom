import { ReactElement } from 'react'
import { BodyShort, VStack } from '@navikt/ds-react'

import { Historikkinnslag, HistorikkinnslagSkeleton } from '@components/sidemenyer/høyremeny/historikk/Historikkinnslag'
import { useSaksbehandlingsperiodeHistorikk } from '@/hooks/queries/useSaksbehandlingsperiodeHistorikk'

export function Historikk(): ReactElement {
    const { data: historikk, isLoading, isError } = useSaksbehandlingsperiodeHistorikk()

    if (isLoading) return <HistorikkSkeleton />
    if (isError || !historikk) return <></> // vis noe fornuftig
    if (historikk.length === 0) return <BodyShort>Ingen historikk</BodyShort>

    return (
        <VStack as="ul" role="list" aria-label="Historikk over endringer">
            {historikk.map((historikkinnslag, index) => (
                <Historikkinnslag
                    key={`${historikkinnslag.endretTidspunkt}-${index}`}
                    historikkinnslag={historikkinnslag}
                />
            ))}
        </VStack>
    )
}

function HistorikkSkeleton(): ReactElement {
    return (
        <VStack as="ul" role="list" aria-label="Laster historikk">
            <HistorikkinnslagSkeleton />
            <HistorikkinnslagSkeleton />
            <HistorikkinnslagSkeleton />
        </VStack>
    )
}
