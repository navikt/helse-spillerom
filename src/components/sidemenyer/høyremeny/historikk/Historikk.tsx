import { ReactElement } from 'react'
import { BodyShort, VStack } from '@navikt/ds-react'

import { Historikkinnslag, HistorikkinnslagSkeleton } from '@components/sidemenyer/høyremeny/historikk/Historikkinnslag'

export function Historikk(): ReactElement {
    const { data: historikk, isLoading, isError } = { data: [], isLoading: false, isError: false } // useHistorikk()

    if (isLoading) return <HistorikkSkeleton />
    if (isError || !historikk) return <></> // vis noe fornuftig
    if (historikk.length === 0) return <BodyShort>Ingen historikk</BodyShort>

    return (
        <VStack as="ul">
            {historikk.map((historikkinnslag) => (
                <Historikkinnslag key={historikkinnslag} historikkinnslag={historikkinnslag} />
            ))}
        </VStack>
    )
}

function HistorikkSkeleton(): ReactElement {
    return (
        <VStack as="ul">
            <HistorikkinnslagSkeleton />
            <HistorikkinnslagSkeleton />
            <HistorikkinnslagSkeleton />
        </VStack>
    )
}
