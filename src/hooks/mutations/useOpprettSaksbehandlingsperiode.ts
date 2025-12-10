import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'
import {
    invaliderAlleSaksbehandlingsperioder,
    invaliderSaksbehandlingsperiodeHistorikk,
    invaliderTidslinje,
    refetchQuery,
} from '@utils/queryInvalidation'
import { queryKeys } from '@utils/queryKeys'
import { usePersonRouteParams } from '@hooks/useRouteParams'

interface MutationProps {
    request: {
        fom: string
        tom: string
        søknader: string[] // Array of søknad IDs
    }
    callback: (periode: Saksbehandlingsperiode) => void
}

export function useOpprettSaksbehandlingsperiode() {
    const { personId } = usePersonRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ request }) =>
            postAndParse(`/api/bakrommet/v1/${personId}/behandlinger`, saksbehandlingsperiodeSchema, request),
        onSuccess: async (periode, r) => {
            // Invalidate all saksbehandlingsperioder caches
            await invaliderAlleSaksbehandlingsperioder(queryClient)
            await refetchQuery(queryClient, queryKeys.saksbehandlingsperioder(personId))
            await invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, periode.id)
            await invaliderTidslinje(queryClient, personId)
            r.callback(periode)
        },
    })
}
