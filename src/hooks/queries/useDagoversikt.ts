import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Dagoversikt, dagoversiktSchema } from '@/schemas/dagoversikt'

interface UseDagoversiktParams {
    inntektsforholdId?: string
}

export function useDagoversikt({ inntektsforholdId }: UseDagoversiktParams) {
    const params = useParams()

    return useQuery<Dagoversikt, ProblemDetailsError>({
        queryKey: [params.personId, 'dagoversikt', params.saksbehandlingsperiodeId, inntektsforholdId],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/inntektsforhold/${inntektsforholdId}/dagoversikt`,
                dagoversiktSchema,
            ),
        enabled: !!params.personId && !!params.saksbehandlingsperiodeId && !!inntektsforholdId,
    })
} 