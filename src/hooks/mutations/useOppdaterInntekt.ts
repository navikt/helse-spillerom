import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putNoContent } from '@utils/fetch'
import { InntektRequest } from '@/schemas/inntektRequest'
import {
    invaliderDokumenter,
    invaliderYrkesaktivitet,
    invaliderSykepengegrunnlag,
    invaliderUtbetalingsberegning,
    invaliderHistory,
} from '@utils/queryInvalidation'

type MutationProps = {
    yrkesaktivitetId: string
    inntektRequest: InntektRequest
}

export function useOppdaterInntekt() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, MutationProps>({
        mutationFn: async ({ yrkesaktivitetId, inntektRequest }) => {
            return await putNoContent(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/inntekt`,
                inntektRequest,
            )
        },
        onSuccess: () => {
            const personId = params.personId as string
            const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

            //hvis requesten var ainntekt, inntektsmelding eller sigrun så kan det bære at vi må hente dokumenter på nytt
            // TODO denne kan optimaliseres ved å se på hva slags inntekt som ble requestet
            invaliderDokumenter(queryClient, personId, saksbehandlingsperiodeId)
            invaliderYrkesaktivitet(queryClient, personId, saksbehandlingsperiodeId)
            invaliderSykepengegrunnlag(queryClient, personId, saksbehandlingsperiodeId)
            invaliderUtbetalingsberegning(queryClient, personId, saksbehandlingsperiodeId)
            invaliderHistory(queryClient, personId, saksbehandlingsperiodeId)
        },
    })
}
