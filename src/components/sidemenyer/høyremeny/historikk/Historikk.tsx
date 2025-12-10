import { ReactElement } from 'react'
import { BodyShort, VStack } from '@navikt/ds-react'

import { Historikkinnslag, HistorikkinnslagSkeleton } from '@components/sidemenyer/høyremeny/historikk/Historikkinnslag'
import { useBehandlingHistorikk } from '@hooks/queries/useBehandlingHistorikk'

export function Historikk(): ReactElement {
    const { data: historikk, isLoading, isError } = useBehandlingHistorikk()

    if (isLoading) return <HistorikkSkeleton />
    if (isError || !historikk) return <></> // vis noe fornuftig
    if (historikk.length === 0) return <BodyShort>Ingen historikk</BodyShort>

    const sorterteHistorikkinnslag = [...historikk].sort((a, b) => b.endretTidspunkt.localeCompare(a.endretTidspunkt))

    return (
        <VStack as="ul" role="list" aria-label="Historikk over endringer">
            {sorterteHistorikkinnslag.map((historikkinnslag, index) => (
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
