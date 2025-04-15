import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Vilkarsvurdering } from '@typer/manuellbehandlingtypes'

interface MutationProps {
    request: {
        vilkar: string[]
    }
}

export function useNyeVilkaar() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Vilkarsvurdering[], Error, MutationProps>({
        mutationFn: async (r) => {
            return (await (
                await fetch(`/api/${params.aktorId}/behandling/${params.behandlingId}/vilkar`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(r.request.vilkar),
                })
            ).json()) as Vilkarsvurdering[]
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
