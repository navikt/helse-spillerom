import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

export function useSlettTilkommenInntekt() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const personId = params.personId as string
    const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

    return useMutation<void, ProblemDetailsError, { tilkommenInntektId: string }>({
        mutationFn: async ({ tilkommenInntektId }) => {
            await deleteNoContent(
                `/api/bakrommet/v1/${personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/tilkommeninntekt/${tilkommenInntektId}`,
            )
        },
        onSuccess: () => {
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
                queryKey: [personId, 'utbetalingsberegning', saksbehandlingsperiodeId],
            })

            // Invalider tidslinje queries
            queryClient.invalidateQueries({
                queryKey: ['tidslinje', personId],
            })

            // Naviger tilbake til hovedsiden for saksbehandlingsperioden
            router.push(`/person/${personId}/${saksbehandlingsperiodeId}`)
        },
    })
}
