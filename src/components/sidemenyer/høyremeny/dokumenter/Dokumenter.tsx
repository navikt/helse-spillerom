'use client'

import React, { ReactElement } from 'react'
import { BodyShort, VStack } from '@navikt/ds-react'

import { useDokumenter } from '@hooks/queries/useDokumenter'
import { Dokument, DokumentSkeleton } from '@components/sidemenyer/høyremeny/dokumenter/Dokument'
import { FetchError } from '@components/saksbilde/FetchError'

export function Dokumenter(): ReactElement {
    const { data: dokumenter, isLoading, isError, refetch } = useDokumenter()

    if (isLoading) return <DokumenterSkeleton />
    if (isError || !dokumenter) {
        return <FetchError refetch={refetch} message="Kunne ikke laste dokumenter." />
    }
    if (dokumenter.length === 0) return <BodyShort>Ingen dokumenter</BodyShort>

    return (
        <VStack as="ul" role="list" aria-label="Dokumenter">
            {dokumenter.map((dokument) => (
                <Dokument key={dokument.id} dokument={dokument} />
            ))}
        </VStack>
    )
}

function DokumenterSkeleton(): ReactElement {
    return (
        <VStack as="ul" role="list" aria-label="Laster dokumenter">
            <DokumentSkeleton />
            <DokumentSkeleton />
            <DokumentSkeleton />
        </VStack>
    )
}
