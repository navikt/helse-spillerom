import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import {
    tilkommenInntektResponseSchema,
    OpprettTilkommenInntektRequest,
    TilkommenInntektResponse,
} from '@schemas/tilkommenInntekt'
import { invaliderTilkommenInntektRelaterteQueries } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

export function useOpprettTilkommenInntekt() {
    const { pseudoId, behandlingId } = useRouteParams()
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation<TilkommenInntektResponse, Error, OpprettTilkommenInntektRequest>({
        mutationFn: async (request) => {
            return await postAndParse(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/tilkommeninntekt`,
                tilkommenInntektResponseSchema,
                request,
            )
        },
        onSuccess: (data) => {
            invaliderTilkommenInntektRelaterteQueries(queryClient, pseudoId, behandlingId)

            // Naviger til visningssiden
            router.push(`/person/${pseudoId}/${behandlingId}/tilkommen-inntekt/${data.id}`)
        },
    })
}
