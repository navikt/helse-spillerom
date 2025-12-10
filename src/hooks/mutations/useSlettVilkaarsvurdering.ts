import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { invaliderVilkaarsvurderinger } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

type MutationProps = {
    kode: string
}

export function useSlettVilkaarsvurdering() {
    const { personId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<void, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ kode }) => {
            return await deleteNoContent(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/vilkaarsvurdering/${kode}`,
            )
        },
        onSuccess: () => {
            // Invalidate both v1 and v2 cache keys
            invaliderVilkaarsvurderinger(queryClient, personId, behandlingId)
        },
    })
}
