import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { invaliderYrkesaktivitetRelaterteQueries } from '@utils/queryInvalidation'

export function useSlettYrkesaktivitet() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, ProblemDetailsError, { yrkesaktivitetId: string }>({
        mutationFn: async ({ yrkesaktivitetId }) => {
            await deleteNoContent(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}`,
            )
        },
        onSuccess: () => {
            const personId = params.personId as string
            const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string
            invaliderYrkesaktivitetRelaterteQueries(queryClient, personId, saksbehandlingsperiodeId)
        },
    })
}
