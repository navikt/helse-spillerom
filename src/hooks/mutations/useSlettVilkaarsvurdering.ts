import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

type MutationProps = {
    kode: string
}

export function useSlettVilkaarsvurdering() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ kode }) => {
            return await deleteNoContent(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/vilkaarsvurdering/${kode}`,
            )
        },
        onSuccess: () => {
            // Invalidate both v1 and v2 cache keys
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'vilkaarsvurderinger', params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'vilkaarsvurderinger', params.saksbehandlingsperiodeId],
            })
        },
    })
}
