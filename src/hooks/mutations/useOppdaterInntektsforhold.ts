import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Inntektsforhold, inntektsforholdSchema } from '@/schemas/inntektsforhold'
import { putAndParse } from '@utils/fetch'

type MutationProps = {
    inntektsforholdId: string
    kategorisering: Record<string, string | string[]>
}

export function useOppdaterInntektsforhold() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Inntektsforhold, Error, MutationProps>({
        mutationFn: async ({ inntektsforholdId, kategorisering }) => {
            console.log('putter ', inntektsforholdId)
            return await putAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/inntektsforhold/${inntektsforholdId}`,
                inntektsforholdSchema,
                {
                    kategorisering,
                },
            )
        },
        onSuccess: () => {
            console.log('invalidated')
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'inntektsforhold', params.saksbehandlingsperiodeId],
            })
        },
    })
}
