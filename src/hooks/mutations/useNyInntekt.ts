import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Inntekt, NyInntekt } from '@typer/manuellbehandlingtypes'

interface MutationProps {
    request: {
        inntekt: NyInntekt
    }
    callback: (inntekt: Inntekt) => void
}

export function useNyInntekt() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Inntekt, Error, MutationProps>({
        mutationFn: async (r) => {
            return (await (
                await fetch(`/api/${params.aktorId}/behandling/${params.behandlingId}/inntekt`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(r.request.inntekt),
                })
            ).json()) as Inntekt
        },
        onSuccess: async (inntekt, r) => {
            r.callback(inntekt)
            queryClient
                .invalidateQueries({
                    queryKey: ['inntekt', params.aktorId, params.behandlingId],
                })
                .catch()
        },
    })
}
