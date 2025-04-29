'use client'

import { ReactElement } from 'react'
import { BodyShort, VStack } from '@navikt/ds-react'

import { useDokumenter } from '@hooks/queries/useDokumenter'
import { Dokument, DokumentSkeleton } from '@components/sidemenyer/høyremeny/Dokument'

export function Dokumenter(): ReactElement {
    const { data: dokumenter, isLoading, isError } = useDokumenter()

    if (isLoading) return <DokumenterSkeleton />
    if (isError || !dokumenter) return <></> // vis noe fornuftig
    if (dokumenter.length === 0) return <BodyShort>Ingen dokumenter</BodyShort>

    return (
        <VStack as="ul">
            {dokumenter.map((dokument) => (
                <Dokument key={dokument.id} dokument={dokument} />
            ))}
        </VStack>
    )
}

function DokumenterSkeleton(): ReactElement {
    return (
        <VStack as="ul">
            <DokumentSkeleton />
            <DokumentSkeleton />
            <DokumentSkeleton />
        </VStack>
    )
}
