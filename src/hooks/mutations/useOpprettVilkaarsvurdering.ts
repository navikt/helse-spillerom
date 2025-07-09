import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Vilkaarsvurdering, Vurdering } from '@/schemas/vilkaarsvurdering'

type MutationProps = {
    kode: string
    vurdering: Vurdering
    årsak: string
    notat?: string
}

export function useOpprettVilkaarsvurdering() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Vilkaarsvurdering, Error, MutationProps>({
        mutationFn: async ({ kode, vurdering, årsak, notat }) => {
            return {
                kode,
                vurdering,
                årsak,
                notat,
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'vilkaarsvurderinger', params.saksbehandlingsperiodeId],
            })
        },
    })
}
