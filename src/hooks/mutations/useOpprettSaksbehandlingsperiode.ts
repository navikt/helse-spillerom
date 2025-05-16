import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'

interface MutationProps {
    request: {
        fom: string
        tom: string
        sykepengesoknadIder: string[] // Array of søknad IDs
    }
    callback: (periode: Saksbehandlingsperiode) => void
}

export function useOpprettSaksbehandlingsperiode() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ request }) =>
            postAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder`,
                saksbehandlingsperiodeSchema,
                request,
            ),
        onSuccess: async (periode, r) => {
            await queryClient.refetchQueries({ queryKey: ['saksbehandlingsperioder', params.personId] })
            r.callback(periode)
        },
    })
}
