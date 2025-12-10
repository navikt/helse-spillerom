import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'
import { invaliderSaksbehandlingsperiodeStatusQueries } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

interface MutationProps {
    saksbehandlingsperiodeId: string
    individuellBegrunnelse: string | undefined
}

interface UseSendTilBeslutningProps {
    onSuccess?: () => void
}

export function useSendTilBeslutning({ onSuccess }: UseSendTilBeslutningProps = {}) {
    const { personId, saksbehandlingsperiodeId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ saksbehandlingsperiodeId, individuellBegrunnelse }) =>
            postAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeId}/sendtilbeslutning`,
                saksbehandlingsperiodeSchema,
                { individuellBegrunnelse },
            ),
        onSuccess: async () => {
            await invaliderSaksbehandlingsperiodeStatusQueries(queryClient, personId, saksbehandlingsperiodeId)

            // Kjør callback etter at cache invalidation er ferdig
            onSuccess?.()
        },
    })
}
