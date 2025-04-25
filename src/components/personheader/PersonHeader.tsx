'use client'

import { PropsWithChildren, ReactElement } from 'react'
import { HStack, Skeleton } from '@navikt/ds-react'
import { FigureCombinationIcon } from '@navikt/aksel-icons'

import { NavnOgAlder } from '@components/personheader/NavnOgAlder'
import { Fødselsnummer } from '@components/personheader/Fødselsnummer'
import { AktørId } from '@components/personheader/AktørId'
import { usePersoninfo } from '@hooks/queries/usePersoninfo'

export function PersonHeader(): ReactElement {
    const { data: personinfo, isLoading, isError } = usePersoninfo()

    if (isLoading) return <PersonHeaderSkeleton />
    if (isError || !personinfo) return <></> // vis noe fornuftig

    return (
        <PersonHeaderContainer>
            <FigureCombinationIcon fontSize="1.5rem" className="mr-2" />
            <NavnOgAlder navn={personinfo.navn} alder={personinfo.alder} />
            <Seperator />
            <Fødselsnummer fødselsnummer={personinfo.fødselsnummer} />
            <Seperator />
            <AktørId aktørId={personinfo.aktørId} />
        </PersonHeaderContainer>
    )
}

function PersonHeaderSkeleton(): ReactElement {
    return (
        <PersonHeaderContainer>
            <Skeleton width={210} />
            <Seperator />
            <Skeleton width={127} />
            <Seperator />
            <Skeleton width={210} />
        </PersonHeaderContainer>
    )
}

function PersonHeaderContainer({ children }: PropsWithChildren): ReactElement {
    return (
        <HStack as="header" className="h-12 border-b bg-[#f8f8f8] px-8" align="center">
            {children}
        </HStack>
    )
}

function Seperator(): ReactElement {
    return <span className="mx-4">/</span>
}
