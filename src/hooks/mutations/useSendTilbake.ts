import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'

interface MutationProps {
    saksbehandlingsperiodeId: string
}

export function useSendTilbake() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ saksbehandlingsperiodeId }) =>
            postAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/sendtilbake`,
                saksbehandlingsperiodeSchema,
                {},
            ),
        onSuccess: async () => {
            // Invalidate all saksbehandlingsperioder caches
            await queryClient.invalidateQueries({ queryKey: ['alle-saksbehandlingsperioder'] })
            await queryClient.invalidateQueries({ queryKey: ['saksbehandlingsperioder', params.personId] })
            await queryClient.invalidateQueries({
                queryKey: ['saksbehandlingsperiode-historikk', params.personId, params.saksbehandlingsperiodeId],
            })
        },
    })
}
