import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putNoContent } from '@utils/fetch'
import { Dagoversikt } from '@/schemas/dagoversikt'

type KategoriseringMutationProps = {
    inntektsforholdId: string
    kategorisering: Record<string, string | string[]>
}

type DagoversiktMutationProps = {
    inntektsforholdId: string
    dagoversikt: Dagoversikt
}

export function useOppdaterInntektsforholdKategorisering() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, KategoriseringMutationProps>({
        mutationFn: async ({ inntektsforholdId, kategorisering }) => {
            return await putNoContent(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/inntektsforhold/${inntektsforholdId}/kategorisering`,
                kategorisering,
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'inntektsforhold', params.saksbehandlingsperiodeId],
            })
        },
    })
}

export function useOppdaterInntektsforholdDagoversikt() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, DagoversiktMutationProps>({
        mutationFn: async ({ inntektsforholdId, dagoversikt }) => {
            return await putNoContent(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/inntektsforhold/${inntektsforholdId}/dagoversikt`,
                dagoversikt,
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'inntektsforhold', params.saksbehandlingsperiodeId],
            })
        },
    })
}
