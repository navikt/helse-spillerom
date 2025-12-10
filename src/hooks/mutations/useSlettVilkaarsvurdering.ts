import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { invaliderVilkaarsvurderinger } from '@utils/queryInvalidation'

type MutationProps = {
    kode: string
}

export function useSlettVilkaarsvurdering() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ kode }) => {
            return await deleteNoContent(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/vilkaarsvurdering/${kode}`,
            )
        },
        onSuccess: () => {
            const personId = params.personId as string
            const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string
            // Invalidate both v1 and v2 cache keys
            invaliderVilkaarsvurderinger(queryClient, personId, saksbehandlingsperiodeId)
        },
    })
}
