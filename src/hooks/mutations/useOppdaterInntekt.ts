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
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/inntekt`,
                inntektRequest,
            )
        },
        onSuccess: () => {
            // Invalider yrkesaktivitet queries
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'yrkesaktivitet', params.saksbehandlingsperiodeId],
            })
            // Invalider sykepengegrunnlag queries
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlagV2', params.personId, params.saksbehandlingsperiodeId],
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
