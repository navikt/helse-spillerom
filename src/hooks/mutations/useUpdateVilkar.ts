import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Vilkarsvurdering } from '@typer/manuellbehandlingtypes'

interface MutationProps {
    request: Vilkarsvurdering
}

export function useUpdateVilkaar() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, MutationProps>({
        mutationFn: async (r) => {
            return await (
                await fetch(`/api/${params.aktorId}/behandling/${params.behandlingId}/vilkar/${r.request.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(r.request),
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
