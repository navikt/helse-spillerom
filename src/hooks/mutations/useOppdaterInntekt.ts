import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putNoContent } from '@utils/fetch'
import { InntektRequest } from '@/schemas/inntektRequest'
import {
    invaliderDokumenter,
    invaliderYrkesaktivitet,
    invaliderSykepengegrunnlag,
    invaliderUtbetalingsberegning,
    invaliderHistory,
} from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

type MutationProps = {
    yrkesaktivitetId: string
    inntektRequest: InntektRequest
}

export function useOppdaterInntekt() {
    const { personId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, MutationProps>({
        mutationFn: async ({ yrkesaktivitetId, inntektRequest }) => {
            return await putNoContent(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/yrkesaktivitet/${yrkesaktivitetId}/inntekt`,
                inntektRequest,
            )
        },
        onSuccess: () => {
            //hvis requesten var ainntekt, inntektsmelding eller sigrun så kan det bære at vi må hente dokumenter på nytt
            // TODO denne kan optimaliseres ved å se på hva slags inntekt som ble requestet
            invaliderDokumenter(queryClient, personId, behandlingId)
            invaliderYrkesaktivitet(queryClient, personId, behandlingId)
            invaliderSykepengegrunnlag(queryClient, personId, behandlingId)
            invaliderUtbetalingsberegning(queryClient, personId, behandlingId)
            invaliderHistory(queryClient, personId, behandlingId)
        },
    })
}
