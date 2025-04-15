import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface MutationProps {
    vilkarId: string
}

export function useDeleteVilkar() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, MutationProps>({
        mutationFn: async (r) => {
            return await (
                await fetch(`/api/${params.aktorId}/behandling/${params.behandlingId}/vilkar/${r.vilkarId}`, {
                    method: 'DELETE',
                })
            ).json()
        },
        onSuccess: async () => {
            queryClient
                .invalidateQueries({
                    queryKey: ['vilkar', params.aktorId, params.behandlingId],
                })
                .catch()
        },
    })
}
