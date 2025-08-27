import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putAndParse } from '@utils/fetch'
import {
    SykepengegrunnlagRequest,
    SykepengegrunnlagResponse,
    sykepengegrunnlagResponseSchema,
} from '@/schemas/sykepengegrunnlag'

export function useSettSykepengegrunnlag() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<SykepengegrunnlagResponse, Error, SykepengegrunnlagRequest>({
        mutationFn: async (request) => {
            return await putAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/sykepengegrunnlag`,
                sykepengegrunnlagResponseSchema,
                request,
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlag', params.personId, params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'utbetalingsberegning', params.saksbehandlingsperiodeId],
            })
        },
    })
}
