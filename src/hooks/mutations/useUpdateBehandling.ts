import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Behandling } from '@typer/manuellbehandlingtypes'

interface MutationProps {
    request: Partial<Behandling>
}

export function useUpdateBehandling() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, MutationProps>({
        mutationFn: async (r) => {
            return await (
                await fetch(`/api/${params.aktorId}/behandling/${params.behandlingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(r.request),
                })
            ).json()
        },
        onSuccess: async () => {
            queryClient
                .invalidateQueries({
                    queryKey: ['behandling', params.aktorId, params.behandlingId],
                })
                .catch()
        },
    })
}
