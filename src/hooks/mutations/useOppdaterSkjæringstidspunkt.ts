import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import {
    OppdaterSkjæringstidspunkt,
    Saksbehandlingsperiode,
    saksbehandlingsperiodeSchema,
} from '@/schemas/saksbehandlingsperiode'
import { SkjæringstidspunktSchema } from '@schemas/skjæringstidspunkt'
import {
    invaliderAlleSaksbehandlingsperioder,
    invaliderSaksbehandlingsperioder,
    invaliderSaksbehandlingsperiodeHistorikk,
} from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

interface UseOppdaterSkjæringstidspunktProps {
    onSuccess?: () => void
}

export function useOppdaterSkjæringstidspunkt({ onSuccess }: UseOppdaterSkjæringstidspunktProps = {}) {
    const { personId, saksbehandlingsperiodeId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, SkjæringstidspunktSchema>({
        mutationFn: async ({ saksbehandlingsperiodeId, skjæringstidspunkt }) =>
            putAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeId}/skjaeringstidspunkt`,
                saksbehandlingsperiodeSchema,
                { skjaeringstidspunkt: skjæringstidspunkt } as OppdaterSkjæringstidspunkt,
            ),
        onSuccess: async () => {
            // Invalidate all saksbehandlingsperioder caches
            await invaliderAlleSaksbehandlingsperioder(queryClient)
            await invaliderSaksbehandlingsperioder(queryClient, personId)
            await invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, saksbehandlingsperiodeId)

            // Kjør callback etter at cache invalidation er ferdig
            onSuccess?.()
        },
    })
}
