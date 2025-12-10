import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putAndParse } from '@utils/fetch'
import {
    Vilkaarsvurdering,
    vilkaarsvurderingSchema,
    Vurdering,
    VilkaarsvurderingUnderspørsmål,
} from '@/schemas/vilkaarsvurdering'
import { invaliderVilkaarsvurderinger } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

type MutationProps = {
    kode: string
    vurdering: Vurdering
    underspørsmål: VilkaarsvurderingUnderspørsmål[]
    notat?: string
}

export function useOpprettVilkaarsvurdering() {
    const { pseudoId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Vilkaarsvurdering, Error, MutationProps>({
        mutationFn: async ({ kode, vurdering, underspørsmål, notat }) => {
            return await putAndParse(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/vilkaarsvurdering/${kode}`,
                vilkaarsvurderingSchema,
                {
                    vurdering,
                    underspørsmål,
                    notat,
                },
            )
        },
        onSuccess: () => {
            invaliderVilkaarsvurderinger(queryClient, pseudoId, behandlingId)
        },
    })
}
