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
    const { personId, saksbehandlingsperiodeId } = useRouteParams()
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation<TilkommenInntektResponse, Error, OpprettTilkommenInntektRequest>({
        mutationFn: async (request) => {
            return await postAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeId}/tilkommeninntekt`,
                tilkommenInntektResponseSchema,
                request,
            )
        },
        onSuccess: (data) => {
            invaliderTilkommenInntektRelaterteQueries(queryClient, personId, saksbehandlingsperiodeId)

            // Naviger til visningssiden
            router.push(`/person/${personId}/${saksbehandlingsperiodeId}/tilkommen-inntekt/${data.id}`)
        },
    })
}
