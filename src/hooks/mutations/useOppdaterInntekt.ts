import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putNoContent } from '@utils/fetch'
import { InntektRequest } from '@/schemas/inntektRequest'

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
            //hvis requesten var ainntekt, inntektsmelding eller sigrun så kan det bære at vi må hente dokumenter på nytt
            // TODO denne kan optimaliseres ved å se på hva slags inntekt som ble requestet
            queryClient.invalidateQueries({
                queryKey: ['dokumenter', params.personId, params.saksbehandlingsperiodeId],
            })

            // Invalider yrkesaktivitet queries
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'yrkesaktivitet', params.saksbehandlingsperiodeId],
            })

            // Invalider sykepengegrunnlag queries
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlag', params.personId, params.saksbehandlingsperiodeId],
            })
            // Invalider utbetalingsberegning queries
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'utbetalingsberegning', params.saksbehandlingsperiodeId],
            })
            // Invalider history queries siden inntekt endringer påvirker historikk
            queryClient.invalidateQueries({
                queryKey: ['history', params.personId, params.saksbehandlingsperiodeId],
            })
        },
    })
}
