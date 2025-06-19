import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Dagoversikt, dagoversiktSchema } from '@/schemas/dagoversikt'

interface UseDagoversiktParams {
    inntektsforholdId?: string
}

export function useDagoversikt({ inntektsforholdId }: UseDagoversiktParams) {
    const params = useParams()
    const router = useRouter()

    const query = useQuery<Dagoversikt, ProblemDetailsError>({
        queryKey: [params.personId, 'dagoversikt', params.saksbehandlingsperiodeId, inntektsforholdId],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/inntektsforhold/${inntektsforholdId}/dagoversikt`,
                dagoversiktSchema,
            ),
        enabled: !!params.personId && !!params.saksbehandlingsperiodeId && !!inntektsforholdId,
    })

    useEffect(() => {
        if (query.error && query.error.problem.status === 404) {
            // Naviger til rot-nivået hvis API-et returnerer 404
            router.push('/')
        }
    }, [query.error, router])

    return query
}
