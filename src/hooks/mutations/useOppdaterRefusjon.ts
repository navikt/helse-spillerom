import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putNoContent } from '@utils/fetch'
import { RefusjonInfo } from '@schemas/inntektRequest'

type MutationProps = {
    yrkesaktivitetId: string
    refusjon: RefusjonInfo[] | null
}

export function useOppdaterRefusjon() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, MutationProps>({
        mutationFn: async ({ yrkesaktivitetId, refusjon }) => {
            return await putNoContent(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/refusjon`,
                refusjon,
            )
        },
        onSuccess: () => {
            // Invalider yrkesaktivitet queries
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'yrkesaktivitet', params.saksbehandlingsperiodeId],
            })
            // Invalider sykepengegrunnlag queries
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlag', params.personId, params.saksbehandlingsperiodeId],
            })
            // Invalider utbetalingsberegning queries
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'utbetalingsberegning', params.saksbehandlingsperiodeId],
            })
            // Invalider historikk siden refusjon endring kan legge til ny historikkinnslag
            queryClient.invalidateQueries({
                queryKey: ['saksbehandlingsperiode-historikk', params.personId, params.saksbehandlingsperiodeId],
            })
        },
    })
}
