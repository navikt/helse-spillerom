import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putAndParse } from '@utils/fetch'
import {
    Vilkaarsvurdering,
    vilkaarsvurderingSchema,
    Vurdering,
    VilkaarsvurderingArsak,
} from '@/schemas/vilkaarsvurdering'

type MutationProps = {
    kode: string
    vurdering: Vurdering
    årsaker: VilkaarsvurderingArsak[]
    notat?: string
}

export function useOpprettVilkaarsvurdering() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Vilkaarsvurdering, Error, MutationProps>({
        mutationFn: async ({ kode, vurdering, årsaker, notat }) => {
            return await putAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/vilkaar/${kode}`,
                vilkaarsvurderingSchema,
                {
                    vurdering,
                    årsaker,
                    notat,
                },
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'vilkaarsvurderinger', params.saksbehandlingsperiodeId],
            })
        },
    })
}
