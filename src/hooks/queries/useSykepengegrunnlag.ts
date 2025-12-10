import { useQuery } from '@tanstack/react-query'

import { fetchAndParse } from '@utils/fetch'
import { SykepengegrunnlagResponse, sykepengegrunnlagResponseSchema } from '@/schemas/sykepengegrunnlag'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

export function useSykepengegrunnlag() {
    const { personId, saksbehandlingsperiodeId } = useRouteParams()

    return useQuery<SykepengegrunnlagResponse | null, ProblemDetailsError>({
        queryKey: queryKeys.sykepengegrunnlag(personId, saksbehandlingsperiodeId),
        queryFn: async (): Promise<SykepengegrunnlagResponse | null> => {
            if (!personId || !saksbehandlingsperiodeId) {
                throw new Error('PersonId og saksbehandlingsperiodeId må være tilstede')
            }

            return await fetchAndParse(
                `/api/bakrommet/v2/${personId}/behandlinger/${saksbehandlingsperiodeId}/sykepengegrunnlag`,
                sykepengegrunnlagResponseSchema.nullable(),
            )
        },
        enabled: !!personId && !!saksbehandlingsperiodeId,
        staleTime: 5 * 60 * 1000, // 5 minutter
    })
}
