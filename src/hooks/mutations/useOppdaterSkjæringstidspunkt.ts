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
    const { personId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, SkjæringstidspunktSchema>({
        mutationFn: async ({ saksbehandlingsperiodeId: behandlingId, skjæringstidspunkt }) =>
            putAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/skjaeringstidspunkt`,
                saksbehandlingsperiodeSchema,
                { skjaeringstidspunkt: skjæringstidspunkt } as OppdaterSkjæringstidspunkt,
            ),
        onSuccess: async () => {
            // Invalidate all saksbehandlingsperioder caches
            await invaliderAlleSaksbehandlingsperioder(queryClient)
            await invaliderSaksbehandlingsperioder(queryClient, personId)
            await invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, behandlingId)

            // Kjør callback etter at cache invalidation er ferdig
            onSuccess?.()
        },
    })
}
