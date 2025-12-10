import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import {
    SykepengegrunnlagResponse,
    sykepengegrunnlagResponseSchema,
    OpprettSykepengegrunnlagRequest,
} from '@/schemas/sykepengegrunnlag'
import { invaliderBeregningsrelaterteQueries } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

export function useOpprettSykepengegrunnlag() {
    const { pseudoId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<SykepengegrunnlagResponse, ProblemDetailsError, OpprettSykepengegrunnlagRequest>({
        mutationFn: async (request) => {
            return await postAndParse(
                `/api/bakrommet/v2/${pseudoId}/behandlinger/${behandlingId}/sykepengegrunnlag`,
                sykepengegrunnlagResponseSchema,
                request,
            )
        },
        onSuccess: () => {
            invaliderBeregningsrelaterteQueries(queryClient, pseudoId, behandlingId)
        },
    })
}
