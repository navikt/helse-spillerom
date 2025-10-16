import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { fetchAndParse } from '@utils/fetch'
import { SykepengegrunnlagV2, sykepengegrunnlagV2Schema } from '@/schemas/sykepengegrunnlagV2'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

export function useSykepengegrunnlagV2() {
    const params = useParams()
    const personId = params?.personId as string
    const saksbehandlingsperiodeId = params?.saksbehandlingsperiodeId as string

    return useQuery<SykepengegrunnlagV2 | null, ProblemDetailsError>({
        queryKey: ['sykepengegrunnlagV2', personId, saksbehandlingsperiodeId],
        queryFn: async (): Promise<SykepengegrunnlagV2 | null> => {
            if (!personId || !saksbehandlingsperiodeId) {
                throw new Error('PersonId og saksbehandlingsperiodeId må være tilstede')
            }

            return await fetchAndParse(
                `/api/bakrommet/v2/${personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/sykepengegrunnlag`,
                sykepengegrunnlagV2Schema.nullable(),
            )
        },
        enabled: !!personId && !!saksbehandlingsperiodeId,
        staleTime: 5 * 60 * 1000, // 5 minutter
    })
}
