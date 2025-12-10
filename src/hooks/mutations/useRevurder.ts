import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Behandling, behandlingSchema } from '@schemas/behandling'
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
    const { pseudoId, behandlingId: gammelSaksbehandlingsperiodeId } = useRouteParams()
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation<Behandling, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ behandlingId }) =>
            postAndParse(`/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/revurder`, behandlingSchema, {}),
        onSuccess: async (nyPeriode) => {
            // Invalidate all saksbehandlingsperioder caches
            await invaliderAlleSaksbehandlingsperioder(queryClient)
            await invaliderSaksbehandlingsperioder(queryClient, pseudoId)
            // Invalider historikk for både gammel og ny periode
            await invaliderSaksbehandlingsperiodeHistorikk(queryClient, pseudoId, gammelSaksbehandlingsperiodeId)
            await invaliderSaksbehandlingsperiodeHistorikk(queryClient, pseudoId, nyPeriode.id)
            await invaliderTidslinje(queryClient, pseudoId)

            // Naviger til den nye perioden
            router.push(`/person/${pseudoId}/${nyPeriode.id}`)
        },
    })
}
