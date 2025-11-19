'use client'

import { ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Skeleton } from '@navikt/ds-react'
import { ArrowLeftIcon } from '@navikt/aksel-icons'

import { useTilkommenInntektById } from '@hooks/queries/useTilkommenInntektById'
import { TilkommenInntektView } from '@components/saksbilde/tilkommen-inntekt/TilkommenInntektView'
import { FetchError } from '@components/saksbilde/FetchError'

export default function TilkommenInntektPage(): ReactElement {
    const router = useRouter()
    const { data: tilkommenInntekt, isLoading, isError, refetch } = useTilkommenInntektById()

    if (isLoading) {
        return (
            <section className="flex-auto p-8">
                <Skeleton variant="rectangle" height={400} />
            </section>
        )
    }

    if (isError || !tilkommenInntekt) {
        return (
            <section className="flex-auto p-8">
                <FetchError refetch={() => void refetch()} message="Kunne ikke laste tilkommen inntekt." />
            </section>
        )
    }

    return (
        <section className="flex-auto">
            <div className="p-8">
                <Button
                    variant="tertiary"
                    size="small"
                    icon={<ArrowLeftIcon aria-hidden />}
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    Tilbake
                </Button>
            </div>
            <TilkommenInntektView tilkommenInntekt={tilkommenInntekt} />
        </section>
    )
}
