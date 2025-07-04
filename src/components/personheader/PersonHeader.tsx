'use client'

import { PropsWithChildren, ReactElement } from 'react'
import { BodyShort, Button, HStack, Skeleton } from '@navikt/ds-react'
import { FigureCombinationIcon } from '@navikt/aksel-icons'

import { NavnOgAlder } from '@components/personheader/NavnOgAlder'
import { Fødselsnummer } from '@components/personheader/Fødselsnummer'
import { AktørId } from '@components/personheader/AktørId'
import { usePersoninfo } from '@hooks/queries/usePersoninfo'

export function PersonHeader(): ReactElement {
    const { data: personinfo, isLoading, isError, refetch } = usePersoninfo()

    if (isLoading) return <PersonHeaderSkeleton />
    if (isError || !personinfo) return <PersonHeaderError refetch={() => refetch()} />

    return (
        <PersonHeaderContainer>
            <FigureCombinationIcon aria-hidden fontSize="1.5rem" className="mr-2" />
            <NavnOgAlder navn={personinfo.navn} alder={personinfo.alder} />
            <Seperator />
            <Fødselsnummer fødselsnummer={personinfo.fødselsnummer} />
            <Seperator />
            <AktørId aktørId={personinfo.aktørId} />
        </PersonHeaderContainer>
    )
}

function PersonHeaderContainer({ children }: PropsWithChildren): ReactElement {
    return (
        <HStack
            as="header"
            className="h-12 border-b border-ax-border-neutral-subtle bg-ax-bg-raised px-8 text-ax-text-neutral"
            align="center"
        >
            {children}
        </HStack>
    )
}

function Seperator(): ReactElement {
    return <span className="mx-4">/</span>
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

function PersonHeaderError({ refetch }: { refetch: () => void }): ReactElement {
    return (
        <PersonHeaderContainer>
            <BodyShort>Kunne ikke hente personinfo akkurat nå.</BodyShort>
            <Button className="ml-4" type="button" size="xsmall" variant="secondary" onClick={refetch}>
                Prøv igjen
            </Button>
        </PersonHeaderContainer>
    )
}
