import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putNoContent } from '@utils/fetch'
import { RefusjonInfo } from '@schemas/inntektRequest'
import { invaliderYrkesaktivitetRelaterteQueries, invaliderBehandlingHistorikk } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

type MutationProps = {
    yrkesaktivitetId: string
    refusjon: RefusjonInfo[] | null
}

export function useOppdaterRefusjon() {
    const { pseudoId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, MutationProps>({
        mutationFn: async ({ yrkesaktivitetId, refusjon }) => {
            return await putNoContent(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/yrkesaktivitet/${yrkesaktivitetId}/refusjon`,
                refusjon,
            )
        },
        onSuccess: () => {
            invaliderYrkesaktivitetRelaterteQueries(queryClient, pseudoId, behandlingId)
            // Invalider historikk siden refusjon endring kan legge til ny historikkinnslag
            invaliderBehandlingHistorikk(queryClient, pseudoId, behandlingId)
        },
    })
}
