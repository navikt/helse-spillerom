import { useParams } from 'next/navigation'
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

interface MutationProps {
    request: {
        fom: string
        tom: string
        søknader: string[] // Array of søknad IDs
    }
    callback: (periode: Saksbehandlingsperiode) => void
}

export function useOpprettSaksbehandlingsperiode() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ request }) =>
            postAndParse(`/api/bakrommet/v1/${params.personId}/behandlinger`, saksbehandlingsperiodeSchema, request),
        onSuccess: async (periode, r) => {
            const personId = params.personId as string
            // Invalidate all saksbehandlingsperioder caches
            await invaliderAlleSaksbehandlingsperioder(queryClient)
            await refetchQuery(queryClient, queryKeys.saksbehandlingsperioder(personId))
            await invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, periode.id)
            await invaliderTidslinje(queryClient, personId)
            r.callback(periode)
        },
    })
}
