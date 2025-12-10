import { useQuery } from '@tanstack/react-query'

import { fetchAndParse } from '@utils/fetch'
import { SykepengegrunnlagResponse, sykepengegrunnlagResponseSchema } from '@/schemas/sykepengegrunnlag'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

export function useSykepengegrunnlag() {
    const { pseudoId, behandlingId } = useRouteParams()

    return useQuery<SykepengegrunnlagResponse | null, ProblemDetailsError>({
        queryKey: queryKeys.sykepengegrunnlag(pseudoId, behandlingId),
        queryFn: async (): Promise<SykepengegrunnlagResponse | null> => {
            if (!pseudoId || !behandlingId) {
                throw new Error('PersonId og behandlingId må være tilstede')
            }

            return await fetchAndParse(
                `/api/bakrommet/v2/${pseudoId}/behandlinger/${behandlingId}/sykepengegrunnlag`,
                sykepengegrunnlagResponseSchema.nullable(),
            )
        },
        enabled: !!pseudoId && !!behandlingId,
        staleTime: 5 * 60 * 1000, // 5 minutter
    })
}
