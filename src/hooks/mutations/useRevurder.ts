import { useRouter } from 'next/navigation'
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
import { useRouteParams } from '@hooks/useRouteParams'

interface MutationProps {
    behandlingId: string
}

export function useRevurder() {
    const { personId, behandlingId: gammelSaksbehandlingsperiodeId } = useRouteParams()
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ behandlingId }) =>
            postAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/revurder`,
                saksbehandlingsperiodeSchema,
                {},
            ),
        onSuccess: async (nyPeriode) => {
            // Invalidate all saksbehandlingsperioder caches
            await invaliderAlleSaksbehandlingsperioder(queryClient)
            await invaliderSaksbehandlingsperioder(queryClient, personId)
            // Invalider historikk for både gammel og ny periode
            await invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, gammelSaksbehandlingsperiodeId)
            await invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, nyPeriode.id)
            await invaliderTidslinje(queryClient, personId)

            // Naviger til den nye perioden
            router.push(`/person/${personId}/${nyPeriode.id}`)
        },
    })
}
