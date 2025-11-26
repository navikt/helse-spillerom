import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

export function useSlettSykepengegrunnlag() {
    const params = useParams()
    const queryClient = useQueryClient()
    const personId = params.personId as string
    const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

    return useMutation<void, ProblemDetailsError, void>({
        mutationFn: async () => {
            await deleteNoContent(
                `/api/bakrommet/v2/${personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/sykepengegrunnlag`,
            )
        },
        onSuccess: () => {
            // Invalider sykepengegrunnlag query
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlag', personId, saksbehandlingsperiodeId],
            })
            // Invalider history queries siden sletting av sykepengegrunnlag påvirker historikk
            queryClient.invalidateQueries({
                queryKey: ['history', personId, saksbehandlingsperiodeId],
            })
            // Invalider utbetalingsberegning queries
            queryClient.invalidateQueries({
                queryKey: [personId, 'utbetalingsberegning', saksbehandlingsperiodeId],
            })
            // Invalider tidslinje queries
            queryClient.invalidateQueries({
                queryKey: ['tidslinje', personId],
            })
        },
    })
}
