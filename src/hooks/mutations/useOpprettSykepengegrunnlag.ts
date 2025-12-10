import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import {
    SykepengegrunnlagResponse,
    sykepengegrunnlagResponseSchema,
    OpprettSykepengegrunnlagRequest,
} from '@/schemas/sykepengegrunnlag'
import { invaliderBeregningsrelaterteQueries } from '@utils/queryInvalidation'

export function useOpprettSykepengegrunnlag() {
    const params = useParams()
    const queryClient = useQueryClient()
    const personId = params.personId as string
    const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

    return useMutation<SykepengegrunnlagResponse, ProblemDetailsError, OpprettSykepengegrunnlagRequest>({
        mutationFn: async (request) => {
            return await postAndParse(
                `/api/bakrommet/v2/${personId}/behandlinger/${saksbehandlingsperiodeId}/sykepengegrunnlag`,
                sykepengegrunnlagResponseSchema,
                request,
            )
        },
        onSuccess: () => {
            invaliderBeregningsrelaterteQueries(queryClient, personId, saksbehandlingsperiodeId)
        },
    })
}
