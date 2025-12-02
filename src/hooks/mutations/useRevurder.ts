import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'

interface MutationProps {
    saksbehandlingsperiodeId: string
}

export function useRevurder() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ saksbehandlingsperiodeId }) =>
            postAndParse(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${saksbehandlingsperiodeId}/revurder`,
                saksbehandlingsperiodeSchema,
                {},
            ),
        onSuccess: async (nyPeriode) => {
            // Lagre personId før navigering kan endre den
            const personId = params.personId

            // Invalidate all saksbehandlingsperioder caches
            await queryClient.invalidateQueries({ queryKey: ['alle-saksbehandlingsperioder'] })

            if (personId) {
                await queryClient.invalidateQueries({ queryKey: ['saksbehandlingsperioder', personId] })
                // Invalider historikk for både gammel og ny periode
                await queryClient.invalidateQueries({
                    queryKey: ['saksbehandlingsperiode-historikk', personId, params.saksbehandlingsperiodeId],
                })
                await queryClient.invalidateQueries({
                    queryKey: ['saksbehandlingsperiode-historikk', personId, nyPeriode.id],
                })
                queryClient.invalidateQueries({
                    queryKey: ['tidslinje', params.personId],
                })
            }

            // Naviger til den nye perioden
            router.push(`/person/${personId}/${nyPeriode.id}`)
        },
    })
}
