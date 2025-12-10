import { useParams } from 'next/navigation'
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

interface UseOppdaterSkjæringstidspunktProps {
    onSuccess?: () => void
}

export function useOppdaterSkjæringstidspunkt({ onSuccess }: UseOppdaterSkjæringstidspunktProps = {}) {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, SkjæringstidspunktSchema>({
        mutationFn: async ({ saksbehandlingsperiodeId, skjæringstidspunkt }) =>
            putAndParse(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${saksbehandlingsperiodeId}/skjaeringstidspunkt`,
                saksbehandlingsperiodeSchema,
                { skjaeringstidspunkt: skjæringstidspunkt } as OppdaterSkjæringstidspunkt,
            ),
        onSuccess: async () => {
            // Lagre personId før navigering kan endre den
            const personId = params.personId as string
            const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

            // Invalidate all saksbehandlingsperioder caches
            await invaliderAlleSaksbehandlingsperioder(queryClient)

            if (personId) {
                await invaliderSaksbehandlingsperioder(queryClient, personId)
                await invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, saksbehandlingsperiodeId)
            }

            // Kjør callback etter at cache invalidation er ferdig
            onSuccess?.()
        },
    })
}
