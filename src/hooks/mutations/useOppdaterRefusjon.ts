import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putNoContent } from '@utils/fetch'
import { RefusjonInfo } from '@schemas/inntektRequest'
import {
    invaliderYrkesaktivitetRelaterteQueries,
    invaliderSaksbehandlingsperiodeHistorikk,
} from '@utils/queryInvalidation'

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
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/refusjon`,
                refusjon,
            )
        },
        onSuccess: () => {
            const personId = params.personId as string
            const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string
            invaliderYrkesaktivitetRelaterteQueries(queryClient, personId, saksbehandlingsperiodeId)
            // Invalider historikk siden refusjon endring kan legge til ny historikkinnslag
            invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, saksbehandlingsperiodeId)
        },
    })
}
