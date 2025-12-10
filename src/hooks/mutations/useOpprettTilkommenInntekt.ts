import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import {
    tilkommenInntektResponseSchema,
    OpprettTilkommenInntektRequest,
    TilkommenInntektResponse,
} from '@schemas/tilkommenInntekt'
import { invaliderTilkommenInntektRelaterteQueries } from '@utils/queryInvalidation'

export function useOpprettTilkommenInntekt() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const personId = params.personId as string
    const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

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
