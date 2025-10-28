import React, { ReactElement } from 'react'
import { Alert, BodyShort, VStack } from '@navikt/ds-react'

import { useAinntektYrkesaktivitet } from '@hooks/queries/useAinntektYrkesaktivitet'
import { AinntektInntektDataView } from '@components/saksbilde/sykepengegrunnlag/form/ainntekt/AinntektInntektDataView'

export function VisAinntekt({ yrkesaktivitetId }: { yrkesaktivitetId: string }): ReactElement {
    const { data, isLoading, isError } = useAinntektYrkesaktivitet(yrkesaktivitetId)

    if (isLoading) {
        return (
            <VStack gap="2" className="m-4 ml-6">
                <BodyShort>Laster a-inntekt...</BodyShort>
            </VStack>
        )
    }

    if (isError) {
        return (
            <VStack gap="2" className="m-4 ml-6">
                <Alert variant="error" size="small">
                    Kunne ikke hente a-inntekt
                </Alert>
            </VStack>
        )
    }

    if (!data) {
        return (
            <VStack gap="2" className="m-4 ml-6">
                <BodyShort>Ingen data tilgjengelig</BodyShort>
            </VStack>
        )
    }

    if (!data.success) {
        return (
            <VStack gap="2" className="m-4 ml-6">
                <Alert variant="warning" size="small">
                    {data.feilmelding}
                </Alert>
            </VStack>
        )
    }

    return (
        <VStack gap="4" className="m-4 ml-6">
            <AinntektInntektDataView inntektData={data.data} />
        </VStack>
    )
}
