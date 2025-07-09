import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putAndParse } from '@utils/fetch'
import {
    VilkaarsvurderingV2,
    vilkaarsvurderingV2Schema,
    Vurdering,
    VilkaarsvurderingV2Arsak,
} from '@/schemas/vilkaarsvurdering'

type MutationPropsV2 = {
    kode: string
    vurdering: Vurdering
    årsaker: VilkaarsvurderingV2Arsak[]
    notat?: string
}

export function useOpprettVilkaarsvurderingV2() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<VilkaarsvurderingV2, Error, MutationPropsV2>({
        mutationFn: async ({ kode, vurdering, årsaker, notat }) => {
            return await putAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/vilkaar/${kode}`,
                vilkaarsvurderingV2Schema,
                {
                    vurdering,
                    årsaker,
                    notat,
                },
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'vilkaarsvurderinger-v2', params.saksbehandlingsperiodeId],
            })
        },
    })
}
