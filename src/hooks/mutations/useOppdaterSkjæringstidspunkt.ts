import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import {
    Saksbehandlingsperiode,
    saksbehandlingsperiodeSchema,
    OppdaterSkjæringstidspunkt,
} from '@/schemas/saksbehandlingsperiode'

interface MutationProps {
    saksbehandlingsperiodeId: string
    skjæringstidspunkt: string | undefined
}

interface UseOppdaterSkjæringstidspunktProps {
    onSuccess?: () => void
}

export function useOppdaterSkjæringstidspunkt({ onSuccess }: UseOppdaterSkjæringstidspunktProps = {}) {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ saksbehandlingsperiodeId, skjæringstidspunkt }) =>
            putAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/skjaeringstidspunkt`,
                saksbehandlingsperiodeSchema,
                { skjaeringstidspunkt: skjæringstidspunkt } as OppdaterSkjæringstidspunkt,
            ),
        onSuccess: async () => {
            // Lagre personId før navigering kan endre den
            const personId = params.personId

            // Invalidate all saksbehandlingsperioder caches
            await queryClient.invalidateQueries({ queryKey: ['alle-saksbehandlingsperioder'] })

            if (personId) {
                await queryClient.invalidateQueries({ queryKey: ['saksbehandlingsperioder', personId] })
                await queryClient.invalidateQueries({
                    queryKey: ['saksbehandlingsperiode-historikk', personId, params.saksbehandlingsperiodeId],
                })
            }

            // Kjør callback etter at cache invalidation er ferdig
            onSuccess?.()
        },
    })
}
