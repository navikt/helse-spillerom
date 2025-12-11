import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putAndParse } from '@utils/fetch'
import {
    oppdaterVilkaarsvurderingResponseSchema,
    OppdaterVilkaarsvurderingResponse,
    Vurdering,
    VilkaarsvurderingUnderspørsmål,
} from '@/schemas/vilkaarsvurdering'
import { invaliderVilkaarsvurderinger, invaliderQuery } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'
import { queryKeys } from '@utils/queryKeys'

type MutationProps = {
    kode: string
    vurdering: Vurdering
    underspørsmål: VilkaarsvurderingUnderspørsmål[]
    notat?: string
}

export function useOpprettVilkaarsvurdering() {
    const { pseudoId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<OppdaterVilkaarsvurderingResponse, Error, MutationProps>({
        mutationFn: async ({ kode, vurdering, underspørsmål, notat }) => {
            return await putAndParse<OppdaterVilkaarsvurderingResponse>(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/vilkaarsvurdering/${kode}`,
                oppdaterVilkaarsvurderingResponseSchema,
                {
                    vurdering,
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
                        break
                    case 'sykepengegrunnlag':
                        invaliderQuery(queryClient, queryKeys.sykepengegrunnlag(pseudoId, behandlingId))
                        break
                }
            })

            // Invalider alltid vilkårsvurderinger
            invaliderVilkaarsvurderinger(queryClient, pseudoId, behandlingId)
        },
    })
}
