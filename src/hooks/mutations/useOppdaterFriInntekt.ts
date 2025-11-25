import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putNoContent } from '@utils/fetch'

type MutationProps = {
    yrkesaktivitetId: string
    inntektRequest: { inntekt?: number | null }
}

export function useOppdaterFriInntekt() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, MutationProps>({
        mutationFn: async ({ yrkesaktivitetId, inntektRequest }) => {
            return await putNoContent(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/fri-inntekt`,
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
                queryKey: ['sykepengegrunnlag', params.personId, params.saksbehandlingsperiodeId],
            })
            // Invalider utbetalingsberegning queries
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'utbetalingsberegning', params.saksbehandlingsperiodeId],
            })
        },
    })
}
