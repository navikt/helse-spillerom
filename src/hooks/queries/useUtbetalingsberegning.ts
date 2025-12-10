import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { BeregningResponse, beregningResponseSchema } from '@schemas/utbetalingsberegning'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

export function useUtbetalingsberegning() {
    const { personId, saksbehandlingsperiodeId } = useRouteParams()
    const router = useRouter()

    const query = useQuery<BeregningResponse | null, ProblemDetailsError>({
        queryKey: queryKeys.utbetalingsberegning(personId, saksbehandlingsperiodeId),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeId}/utbetalingsberegning`,
                z.union([beregningResponseSchema, z.null()]),
            ),
        enabled: !!personId && !!saksbehandlingsperiodeId,
    })

    useEffect(() => {
        if (query.error && query.error.problem?.status === 404) {
            // Naviger til rot-nivået hvis API-et returnerer 404
            router.push('/')
        }
    }, [query.error, router])

    return query
}
