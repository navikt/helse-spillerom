import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'

interface MutationProps {
    saksbehandlingsperiodeId: string
    individuellBegrunnelse: string | undefined
}

interface UseSendTilBeslutningProps {
    onSuccess?: () => void
}

export function useSendTilBeslutning({ onSuccess }: UseSendTilBeslutningProps = {}) {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ saksbehandlingsperiodeId, individuellBegrunnelse }) =>
            postAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/sendtilbeslutning`,
                saksbehandlingsperiodeSchema,
                { individuellBegrunnelse },
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
                await queryClient.invalidateQueries({
                    queryKey: ['tidslinje', params.personId],
                })
            }

            // Kjør callback etter at cache invalidation er ferdig
            onSuccess?.()
        },
    })
}
