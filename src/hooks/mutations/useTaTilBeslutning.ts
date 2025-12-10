import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'
import { invaliderSaksbehandlingsperiodeStatusQueries } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

interface MutationProps {
    saksbehandlingsperiodeId: string
}

export function useTaTilBeslutning() {
    const { personId, saksbehandlingsperiodeId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ saksbehandlingsperiodeId }) =>
            postAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeId}/tatilbeslutning`,
                saksbehandlingsperiodeSchema,
                {},
            ),
        onSuccess: async () => {
            await invaliderSaksbehandlingsperiodeStatusQueries(queryClient, personId, saksbehandlingsperiodeId)
        },
    })
}
