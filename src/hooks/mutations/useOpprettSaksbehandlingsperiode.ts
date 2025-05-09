import { useParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'

interface MutationProps {
    request: {
        fom: string
        tom: string
    }
    callback: (periode: Saksbehandlingsperiode) => void
}

export function useOpprettSaksbehandlingsperiode() {
    const params = useParams()

    return useMutation<Saksbehandlingsperiode, ProblemDetailsError, MutationProps>({
        mutationFn: async ({ request }) =>
            postAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder`,
                saksbehandlingsperiodeSchema,
                request,
            ),
        onSuccess: (periode, r) => r.callback(periode),
    })
}
