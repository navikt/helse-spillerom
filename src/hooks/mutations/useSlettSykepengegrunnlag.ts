import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { invaliderBeregningsrelaterteQueries } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

export function useSlettSykepengegrunnlag() {
    const { pseudoId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<void, ProblemDetailsError, void>({
        mutationFn: async () => {
            await deleteNoContent(`/api/bakrommet/v2/${pseudoId}/behandlinger/${behandlingId}/sykepengegrunnlag`)
        },
        onSuccess: () => {
            invaliderBeregningsrelaterteQueries(queryClient, pseudoId, behandlingId)
        },
    })
}
