import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { invaliderYrkesaktivitetRelaterteQueries } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

export function useSlettYrkesaktivitet() {
    const { personId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<void, ProblemDetailsError, { yrkesaktivitetId: string }>({
        mutationFn: async ({ yrkesaktivitetId }) => {
            await deleteNoContent(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/yrkesaktivitet/${yrkesaktivitetId}`,
            )
        },
        onSuccess: () => {
            invaliderYrkesaktivitetRelaterteQueries(queryClient, personId, behandlingId)
        },
    })
}
