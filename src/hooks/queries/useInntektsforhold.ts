import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { z } from 'zod'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Inntektsforhold, inntektsforholdSchema } from '@/schemas/inntektsforhold'

export function useInntektsforhold() {
    const params = useParams()
    const router = useRouter()

    const query = useQuery<Inntektsforhold[], ProblemDetailsError>({
        queryKey: [params.personId, 'inntektsforhold', params.saksbehandlingsperiodeId],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/inntektsforhold`,
                z.array(inntektsforholdSchema),
            ),
        enabled: !!params.personId && !!params.saksbehandlingsperiodeId,
    })

    useEffect(() => {
        if (query.error && query.error.problem.status === 404) {
            // Naviger til rot-nivået hvis API-et returnerer 404
            router.push('/')
        }
    }, [query.error, router])

    return query
}
