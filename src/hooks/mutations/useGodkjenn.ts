import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'
import { invaliderSaksbehandlingsperiodeStatusQueries } from '@utils/queryInvalidation'

interface MutationProps {
    saksbehandlingsperiodeId: string
}

export function useGodkjenn() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ saksbehandlingsperiodeId }) =>
            postAndParse(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${saksbehandlingsperiodeId}/godkjenn`,
                saksbehandlingsperiodeSchema,
                {},
            ),
        onSuccess: async () => {
            const personId = params.personId as string
            const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string
            await invaliderSaksbehandlingsperiodeStatusQueries(queryClient, personId, saksbehandlingsperiodeId)
        },
    })
}
