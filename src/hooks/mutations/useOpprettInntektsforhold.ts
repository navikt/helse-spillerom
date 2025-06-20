import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { Inntektsforhold, inntektsforholdSchema } from '@/schemas/inntektsforhold'

type MutationProps = {
    kategorisering: Record<string, string | string[]>
}

export function useOpprettInntektsforhold() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Inntektsforhold, Error, MutationProps>({
        mutationFn: async ({ kategorisering }) => {
            return await postAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/inntektsforhold`,
                inntektsforholdSchema,
                {
                    kategorisering,
                },
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'inntektsforhold', params.saksbehandlingsperiodeId],
            })
        },
    })
}
