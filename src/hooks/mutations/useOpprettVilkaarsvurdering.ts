import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putAndParse } from '@utils/fetch'
import {
    Vilkaarsvurdering,
    vilkaarsvurderingSchema,
    Vurdering,
    VilkaarsvurderingUnderspørsmål,
} from '@/schemas/vilkaarsvurdering'
import { invaliderVilkaarsvurderinger } from '@utils/queryInvalidation'

type MutationProps = {
    kode: string
    vurdering: Vurdering
    underspørsmål: VilkaarsvurderingUnderspørsmål[]
    notat?: string
}

export function useOpprettVilkaarsvurdering() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Vilkaarsvurdering, Error, MutationProps>({
        mutationFn: async ({ kode, vurdering, underspørsmål, notat }) => {
            return await putAndParse(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/vilkaarsvurdering/${kode}`,
                vilkaarsvurderingSchema,
                {
                    vurdering,
                    underspørsmål,
                    notat,
                },
            )
        },
        onSuccess: () => {
            const personId = params.personId as string
            const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string
            invaliderVilkaarsvurderinger(queryClient, personId, saksbehandlingsperiodeId)
        },
    })
}
