import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteNoContent } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { invaliderTilkommenInntektRelaterteQueries } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

export function useSlettTilkommenInntekt() {
    const { personId, behandlingId } = useRouteParams()
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation<void, ProblemDetailsError, { tilkommenInntektId: string }>({
        mutationFn: async ({ tilkommenInntektId }) => {
            await deleteNoContent(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/tilkommeninntekt/${tilkommenInntektId}`,
            )
        },
        onSuccess: () => {
            invaliderTilkommenInntektRelaterteQueries(queryClient, personId, behandlingId)

            // Naviger tilbake til hovedsiden for saksbehandlingsperioden
            router.push(`/person/${personId}/${behandlingId}`)
        },
    })
}
