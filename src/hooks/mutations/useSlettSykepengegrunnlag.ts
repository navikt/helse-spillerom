import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'

export function useSlettSykepengegrunnlag() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, void>({
        mutationFn: async () => {
            return await deleteNoContent(
                `/api/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/sykepengegrunnlag`,
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlag', params.personId, params.saksbehandlingsperiodeId],
            })
        },
    })
}
