import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'
import { invaliderSaksbehandlingsperiodeStatusQueries } from '@utils/queryInvalidation'

interface MutationProps {
    saksbehandlingsperiodeId: string
    individuellBegrunnelse: string | undefined
}

interface UseSendTilBeslutningProps {
    onSuccess?: () => void
}

export function useSendTilBeslutning({ onSuccess }: UseSendTilBeslutningProps = {}) {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ saksbehandlingsperiodeId, individuellBegrunnelse }) =>
            postAndParse(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${saksbehandlingsperiodeId}/sendtilbeslutning`,
                saksbehandlingsperiodeSchema,
                { individuellBegrunnelse },
            ),
        onSuccess: async () => {
            // Lagre personId før navigering kan endre den
            const personId = params.personId as string
            const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

            if (personId) {
                await invaliderSaksbehandlingsperiodeStatusQueries(queryClient, personId, saksbehandlingsperiodeId)
            }

            // Kjør callback etter at cache invalidation er ferdig
            onSuccess?.()
        },
    })
}
