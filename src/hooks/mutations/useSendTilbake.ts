import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Behandling, behandlingSchema } from '@schemas/behandling'
import { invaliderSaksbehandlingsperiodeStatusQueries } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

interface MutationProps {
    behandlingId: string
    kommentar: string
}

export function useSendTilbake() {
    const { pseudoId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Behandling, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ behandlingId, kommentar }) =>
            postAndParse(`/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/sendtilbake`, behandlingSchema, {
                kommentar,
            }),
        onSuccess: async () => {
            await invaliderSaksbehandlingsperiodeStatusQueries(queryClient, pseudoId, behandlingId)
        },
    })
}
