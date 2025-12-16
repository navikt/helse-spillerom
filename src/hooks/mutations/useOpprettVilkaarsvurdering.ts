import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putAndParse } from '@utils/fetch'
import {
    oppdaterVilkaarsvurderingResponseSchema,
    OppdaterVilkaarsvurderingResponse,
    Vurdering,
    VilkaarsvurderingUnderspørsmål,
} from '@/schemas/vilkaarsvurdering'
import {
    invaliderVilkaarsvurderinger,
    invaliderQuery,
    invaliderTidslinje,
    invaliderValideringer,
} from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'
import { queryKeys } from '@utils/queryKeys'

type MutationProps = {
    kode: string
    vilkårskode: string
    vurdering: Vurdering
    underspørsmål: VilkaarsvurderingUnderspørsmål[]
    notat?: string
}

export function useOpprettVilkaarsvurdering() {
    const { pseudoId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<OppdaterVilkaarsvurderingResponse, Error, MutationProps>({
        mutationFn: async ({ kode, vurdering, vilkårskode, underspørsmål, notat }) => {
            return await putAndParse<OppdaterVilkaarsvurderingResponse>(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/vilkaarsvurdering/${kode}`,
                oppdaterVilkaarsvurderingResponseSchema,
                {
                    vurdering,
                    vilkårskode,
                    underspørsmål,
                    notat,
                },
            )
        },
        onSuccess: (response) => {
            const invalidations = response.invalidations

            // Invalider queries basert på invalidations-arrayet
            invalidations.forEach((invalidation) => {
                // Map backend invalidation navn til frontend query keys
                switch (invalidation) {
                    case 'utbetalingsberegning':
                        invaliderQuery(queryClient, queryKeys.utbetalingsberegning(pseudoId, behandlingId))
                        break
                    case 'yrkesaktiviteter':
                        invaliderQuery(queryClient, queryKeys.yrkesaktivitet(pseudoId, behandlingId))
                        invaliderTidslinje(queryClient, pseudoId)
                        break
                    case 'sykepengegrunnlag':
                        invaliderQuery(queryClient, queryKeys.sykepengegrunnlag(pseudoId, behandlingId))
                        break
                }
            })

            invaliderVilkaarsvurderinger(queryClient, pseudoId, behandlingId)
            invaliderValideringer(queryClient, pseudoId, behandlingId, false)
        },
    })
}
