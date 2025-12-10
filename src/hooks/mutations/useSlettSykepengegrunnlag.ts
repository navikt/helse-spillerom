import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { invaliderBeregningsrelaterteQueries } from '@utils/queryInvalidation'

export function useSlettSykepengegrunnlag() {
    const params = useParams()
    const queryClient = useQueryClient()
    const personId = params.personId as string
    const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

    return useMutation<void, ProblemDetailsError, void>({
        mutationFn: async () => {
            await deleteNoContent(
                `/api/bakrommet/v2/${personId}/behandlinger/${saksbehandlingsperiodeId}/sykepengegrunnlag`,
            )
        },
        onSuccess: () => {
            invaliderBeregningsrelaterteQueries(queryClient, personId, saksbehandlingsperiodeId)
        },
    })
}
