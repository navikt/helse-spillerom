import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import {
    tilkommenInntektResponseSchema,
    OpprettTilkommenInntektRequest,
    TilkommenInntektResponse,
} from '@schemas/tilkommenInntekt'

export function useOpprettTilkommenInntekt() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const personId = params.personId as string
    const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

    return useMutation<TilkommenInntektResponse, Error, OpprettTilkommenInntektRequest>({
        mutationFn: async (request) => {
            return await postAndParse(
                `/api/bakrommet/v1/${personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/tilkommeninntekt`,
                tilkommenInntektResponseSchema,
                request,
            )
        },
        onSuccess: (data) => {
            // Invalider tilkommen inntekt queries
            queryClient.invalidateQueries({
                queryKey: ['tilkommenInntekt', personId, saksbehandlingsperiodeId],
            })

            // Invalider history queries siden tilkommen inntekt påvirker historikk
            queryClient.invalidateQueries({
                queryKey: ['history', personId, saksbehandlingsperiodeId],
            })
            // Invalider utbetalingsberegning queries
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'utbetalingsberegning', params.saksbehandlingsperiodeId],
            })
            // Invalider tidslinje queries
            queryClient.invalidateQueries({
                queryKey: ['tidslinje', personId],
            })

            // Naviger til visningssiden
            router.push(`/person/${personId}/${saksbehandlingsperiodeId}/tilkommen-inntekt/${data.id}`)
        },
    })
}
