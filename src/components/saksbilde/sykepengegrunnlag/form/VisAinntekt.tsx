import React, { ReactElement, useEffect } from 'react'
import { Alert, BodyShort } from '@navikt/ds-react'

import { useAinntektYrkesaktivitet } from '@hooks/queries/useAinntektYrkesaktivitet'
import { AinntektInntektDataView } from '@components/saksbilde/sykepengegrunnlag/form/ainntekt/AinntektInntektDataView'
import { FetchError } from '@components/saksbilde/FetchError'

interface VisAinntektProps {
    yrkesaktivitetId: string
    setValue: (name: 'data.årsinntekt', value: number) => void
}

export function VisAinntekt({ yrkesaktivitetId, setValue }: VisAinntektProps): ReactElement {
    const { data, isLoading, isError, refetch } = useAinntektYrkesaktivitet(yrkesaktivitetId)

    useEffect(() => {
        if (data?.success) {
            setValue('data.årsinntekt', data.data.omregnetÅrsinntekt ?? 0)
        }
    }, [data, setValue])

    if (isLoading) return <BodyShort>Laster a-inntekt...</BodyShort>

    if (isError || !data) return <FetchError refetch={refetch} message="Kunne ikke hente a-inntekt." />

    if (!data.success) {
        return (
            <Alert variant="warning" size="small">
                {data.feilmelding}
            </Alert>
        )
    }

    return <AinntektInntektDataView inntektData={data.data} />
}
