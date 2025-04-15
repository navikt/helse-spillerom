import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { NyVilkarsvurdering, Vilkarsvurdering } from '@typer/manuellbehandlingtypes'

interface MutationProps {
    request: NyVilkarsvurdering
    callback?: (v: Vilkarsvurdering[]) => void
}

export function useNyttVilkaar() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Vilkarsvurdering[], Error, MutationProps>({
        mutationFn: async (r) => {
            return (await (
                await fetch(`/api/${params.aktorId}/behandling/${params.behandlingId}/vilkar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(r.request),
                })
            ).json()) as Vilkarsvurdering[]
        },
        onSuccess: async (v, r) => {
            if (r.callback) {
                r.callback(v)
            }
            queryClient
                .invalidateQueries({
                    queryKey: ['vilkar', params.aktorId, params.behandlingId],
                })
                .catch()
        },
    })
}
