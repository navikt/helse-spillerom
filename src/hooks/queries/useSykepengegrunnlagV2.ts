import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { fetchAndParse } from '@utils/fetch'
import { SykepengegrunnlagResponse, sykepengegrunnlagResponseSchema } from '@/schemas/sykepengegrunnlagV2'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

export function useSykepengegrunnlagV2() {
    const params = useParams()
    const personId = params?.personId as string
    const saksbehandlingsperiodeId = params?.saksbehandlingsperiodeId as string

    return useQuery<SykepengegrunnlagResponse | null, ProblemDetailsError>({
        queryKey: ['sykepengegrunnlagV2', personId, saksbehandlingsperiodeId],
        queryFn: async (): Promise<SykepengegrunnlagResponse | null> => {
            if (!personId || !saksbehandlingsperiodeId) {
                throw new Error('PersonId og saksbehandlingsperiodeId må være tilstede')
            }

            return await fetchAndParse(
                `/api/bakrommet/v2/${personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/sykepengegrunnlag`,
                sykepengegrunnlagResponseSchema.nullable(),
            )
        },
        enabled: !!personId && !!saksbehandlingsperiodeId,
        staleTime: 5 * 60 * 1000, // 5 minutter
    })
}
