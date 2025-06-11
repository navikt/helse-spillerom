import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { Inntektsforhold, inntektsforholdSchema, Inntektsforholdtype } from '@/schemas/inntektsforhold'

type MutationProps = {
    inntektsforholdtype: Inntektsforholdtype
    sykmeldtFraForholdet: boolean
}

export function useOpprettInntektsforhold() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Inntektsforhold, Error, MutationProps>({
        mutationFn: async ({ inntektsforholdtype, sykmeldtFraForholdet }) => {
            return await postAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/inntektsforhold`,
                inntektsforholdSchema,
                {
                    inntektsforholdtype,
                    sykmeldtFraForholdet,
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
