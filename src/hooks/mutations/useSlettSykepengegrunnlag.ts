import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { invaliderBeregningsrelaterteQueries } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

export function useSlettSykepengegrunnlag() {
    const { personId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<void, ProblemDetailsError, void>({
        mutationFn: async () => {
            await deleteNoContent(`/api/bakrommet/v2/${personId}/behandlinger/${behandlingId}/sykepengegrunnlag`)
        },
        onSuccess: () => {
            invaliderBeregningsrelaterteQueries(queryClient, personId, behandlingId)
        },
    })
}
