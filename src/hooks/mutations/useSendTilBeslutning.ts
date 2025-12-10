import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Behandling, behandlingSchema } from '@schemas/behandling'
import { invaliderSaksbehandlingsperiodeStatusQueries } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

interface MutationProps {
    behandlingId: string
    individuellBegrunnelse: string | undefined
}

interface UseSendTilBeslutningProps {
    onSuccess?: () => void
}

export function useSendTilBeslutning({ onSuccess }: UseSendTilBeslutningProps = {}) {
    const { personId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Behandling, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ behandlingId, individuellBegrunnelse }) =>
            postAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/sendtilbeslutning`,
                behandlingSchema,
                { individuellBegrunnelse },
            ),
        onSuccess: async () => {
            await invaliderSaksbehandlingsperiodeStatusQueries(queryClient, personId, behandlingId)

            // Kjør callback etter at cache invalidation er ferdig
            onSuccess?.()
        },
    })
}
