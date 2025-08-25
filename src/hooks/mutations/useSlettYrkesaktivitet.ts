import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'

export function useSlettYrkesaktivitet() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, ProblemDetailsError, { inntektsforholdId: string }>({
        mutationFn: async ({ inntektsforholdId }) => {
            await deleteNoContent(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/inntektsforhold/${inntektsforholdId}`,
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'inntektsforhold', params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlag', params.personId, params.saksbehandlingsperiodeId],
            })
        },
    })
}
