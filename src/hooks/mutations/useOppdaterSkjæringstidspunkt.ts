import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { OppdaterSkjæringstidspunkt, Behandling, behandlingSchema } from '@schemas/behandling'
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
    const { pseudoId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Behandling, ProblemDetailsError, SkjæringstidspunktSchema>({
        mutationFn: async ({ saksbehandlingsperiodeId: behandlingId, skjæringstidspunkt }) =>
            putAndParse(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/skjaeringstidspunkt`,
                behandlingSchema,
                { skjaeringstidspunkt: skjæringstidspunkt } as OppdaterSkjæringstidspunkt,
            ),
        onSuccess: async () => {
            // Invalidate all saksbehandlingsperioder caches
            await invaliderAlleSaksbehandlingsperioder(queryClient)
            await invaliderSaksbehandlingsperioder(queryClient, pseudoId)
            await invaliderSaksbehandlingsperiodeHistorikk(queryClient, pseudoId, behandlingId)

            // Kjør callback etter at cache invalidation er ferdig
            onSuccess?.()
        },
    })
}
