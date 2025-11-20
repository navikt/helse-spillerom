'use client'

import { ReactElement } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Skeleton } from '@navikt/ds-react'
import { ArrowLeftIcon } from '@navikt/aksel-icons'

import { useTilkommenInntektByParamId } from '@hooks/queries/useTilkommenInntektByParamId'
import { TilkommenInntektView } from '@components/saksbilde/tilkommen-inntekt/TilkommenInntektView'

export default function TilkommenInntektPage(): ReactElement {
    const router = useRouter()
    const { tilkommenInntekt, isLoading } = useTilkommenInntektByParamId()

    if (isLoading || !tilkommenInntekt) {
        return (
            <section className="flex-auto p-8">
                <Skeleton variant="rectangle" height={400} />
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
