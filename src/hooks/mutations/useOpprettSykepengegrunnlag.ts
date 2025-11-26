import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import {
    SykepengegrunnlagResponse,
    sykepengegrunnlagResponseSchema,
    OpprettSykepengegrunnlagRequest,
} from '@/schemas/sykepengegrunnlag'

export function useOpprettSykepengegrunnlag() {
    const params = useParams()
    const queryClient = useQueryClient()
    const personId = params.personId as string
    const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

    return useMutation<SykepengegrunnlagResponse, ProblemDetailsError, OpprettSykepengegrunnlagRequest>({
        mutationFn: async (request) => {
            return await postAndParse(
                `/api/bakrommet/v2/${personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/sykepengegrunnlag`,
                sykepengegrunnlagResponseSchema,
                request,
            )
        },
        onSuccess: () => {
            // Invalider sykepengegrunnlag query
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlag', personId, saksbehandlingsperiodeId],
            })
            // Invalider history queries siden sykepengegrunnlag påvirker historikk
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
