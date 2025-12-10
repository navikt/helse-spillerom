import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Behandling, behandlingSchema } from '@schemas/behandling'
import { invaliderSaksbehandlingsperiodeStatusQueries } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

interface MutationProps {
    behandlingId: string
}

export function useGodkjenn() {
    const { personId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Behandling, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ behandlingId }) =>
            postAndParse(`/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/godkjenn`, behandlingSchema, {}),
        onSuccess: async () => {
            await invaliderSaksbehandlingsperiodeStatusQueries(queryClient, personId, behandlingId)
        },
    })
}
