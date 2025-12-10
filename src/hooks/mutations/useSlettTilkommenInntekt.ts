import { useParams, useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { invaliderTilkommenInntektRelaterteQueries } from '@utils/queryInvalidation'

export function useSlettTilkommenInntekt() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const personId = params.personId as string
    const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

    return useMutation<void, ProblemDetailsError, { tilkommenInntektId: string }>({
        mutationFn: async ({ tilkommenInntektId }) => {
            await deleteNoContent(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeId}/tilkommeninntekt/${tilkommenInntektId}`,
            )
        },
        onSuccess: () => {
            invaliderTilkommenInntektRelaterteQueries(queryClient, personId, saksbehandlingsperiodeId)

            // Naviger tilbake til hovedsiden for saksbehandlingsperioden
            router.push(`/person/${personId}/${saksbehandlingsperiodeId}`)
        },
    })
}
