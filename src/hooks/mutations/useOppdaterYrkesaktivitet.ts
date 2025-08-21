import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putNoContent } from '@utils/fetch'
import { Dagoversikt } from '@/schemas/dagoversikt'

type KategoriseringMutationProps = {
    yrkesaktivitetId: string
    kategorisering: Record<string, string | string[]>
}

type OppdaterDagerMutationProps = {
    yrkesaktivitetId: string
    dager: Dagoversikt // Kun dagene som skal oppdateres
    notat: string
}

export function useOppdaterYrkesaktivitetKategorisering() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, KategoriseringMutationProps>({
        mutationFn: async ({ yrkesaktivitetId, kategorisering }) => {
            return await putNoContent(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/kategorisering`,
                kategorisering,
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'yrkesaktivitet', params.saksbehandlingsperiodeId],
            })
        },
    })
}

export function useOppdaterYrkesaktivitetDagoversikt() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, OppdaterDagerMutationProps>({
        mutationFn: async ({ yrkesaktivitetId, dager }) => {
            // Send kun dagene som skal oppdateres
            return await putNoContent(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/dagoversikt`,
                dager,
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'yrkesaktivitet', params.saksbehandlingsperiodeId],
            })
        },
    })
}
