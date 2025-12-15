import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Behandling, behandlingSchema } from '@schemas/behandling'
import {
    invaliderAlleBehandlinger,
    invaliderBehandlingHistorikk,
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
    callback: (periode: Behandling) => void
}

export function useOpprettBehandling() {
    const { pseudoId } = usePersonRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Behandling, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ request }) =>
            postAndParse(`/api/bakrommet/v1/${pseudoId}/behandlinger`, behandlingSchema, request),
        onSuccess: async (periode, r) => {
            // Invalidate all saksbehandlingsperioder caches
            await invaliderAlleBehandlinger(queryClient)
            await refetchQuery(queryClient, queryKeys.behandlinger(pseudoId))
            await invaliderBehandlingHistorikk(queryClient, pseudoId, periode.id)
            await invaliderTidslinje(queryClient, pseudoId)
            r.callback(periode)
        },
    })
}
