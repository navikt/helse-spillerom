import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'
import {
    invaliderAlleSaksbehandlingsperioder,
    invaliderSaksbehandlingsperioder,
    invaliderSaksbehandlingsperiodeHistorikk,
    invaliderTidslinje,
} from '@utils/queryInvalidation'

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
            const personId = params.personId as string
            const gammelSaksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

            // Invalidate all saksbehandlingsperioder caches
            await invaliderAlleSaksbehandlingsperioder(queryClient)

            if (personId) {
                await invaliderSaksbehandlingsperioder(queryClient, personId)
                // Invalider historikk for både gammel og ny periode
                await invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, gammelSaksbehandlingsperiodeId)
                await invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, nyPeriode.id)
                await invaliderTidslinje(queryClient, personId)
            }

            // Naviger til den nye perioden
            router.push(`/person/${personId}/${nyPeriode.id}`)
        },
    })
}
