import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

export function useSlettYrkesaktivitet() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, ProblemDetailsError, { yrkesaktivitetId: string }>({
        mutationFn: async ({ yrkesaktivitetId }) => {
            await deleteNoContent(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}`,
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'yrkesaktivitet', params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlag', params.personId, params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'utbetalingsberegning', params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: ['tidslinje', params.personId],
            })
        },
    })
}
