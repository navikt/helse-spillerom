import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Behandling } from '@typer/manuellbehandlingtypes'

interface MutationProps {
    request: {
        fom: string
        tom: string
        skjaring: string
        soknadIder: string[]
    }
    callback: (behandling: Behandling) => void
}

export function useNyBehandling() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Behandling, Error, MutationProps>({
        mutationFn: async (r) => {
            return (await (
                await fetch(`/api/${params.aktorId}/behandling`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(r.request),
                })
            ).json()) as Behandling
        },
        onSuccess: async (behandling, r) => {
            r.callback(behandling)
            queryClient
                .invalidateQueries({
                    queryKey: ['behandling', params.aktorId],
                })
                .catch()
        },
    })
}
