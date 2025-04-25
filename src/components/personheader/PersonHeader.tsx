'use client'

import { ReactElement } from 'react'
import { HStack } from '@navikt/ds-react'
import { FigureCombinationIcon } from '@navikt/aksel-icons'

import { NavnOgAlder } from '@components/personheader/NavnOgAlder'
import { Fødselsnummer } from '@components/personheader/Fødselsnummer'
import { AktørId } from '@components/personheader/AktørId'
import { usePersoninfo } from '@hooks/queries/usePersoninfo'

export function PersonHeader(): ReactElement {
    const { data: personinfo, isLoading, isError } = usePersoninfo()

    if (isLoading || !personinfo) return <></> // skeleton
    if (isError) return <></> // feilside

    return (
        <HStack as="header" className="h-12 border-b bg-[#f8f8f8] px-8" align="center">
            <FigureCombinationIcon fontSize="1.5rem" className="mr-2" />
            <NavnOgAlder navn={personinfo.navn} alder={personinfo.alder} />
            <Seperator />
            <Fødselsnummer fødselsnummer={personinfo.fødselsnummer} />
            <Seperator />
            <AktørId aktørId={personinfo.aktørId} />
        </HStack>
    )
}

function Seperator(): ReactElement {
    return <span className="mx-4">/</span>
}
