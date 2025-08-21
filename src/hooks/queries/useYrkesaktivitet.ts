import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Yrkesaktivitet, yrkesaktivitetSchema } from '@/schemas/yrkesaktivitet'

export function useYrkesaktivitet() {
    const params = useParams()
    const router = useRouter()

    const query = useQuery<Yrkesaktivitet[], ProblemDetailsError>({
        queryKey: [params.personId, 'yrkesaktivitet', params.saksbehandlingsperiodeId],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/yrkesaktivitet`,
                z.array(yrkesaktivitetSchema),
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
