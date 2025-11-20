import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { TidslinjeRad, tidslinjeSchema } from '@/schemas/tidslinje'

export function useTidslinje() {
    const params = useParams()
    const router = useRouter()

    const query = useQuery<TidslinjeRad[], ProblemDetailsError>({
        queryKey: ['tidslinje', params.personId],
        queryFn: async () => {
            const tidslinje = await fetchAndParse(`/api/bakrommet/v1/${params.personId}/tidslinje`, tidslinjeSchema)
            return tidslinje.rader
        },
        enabled: !!params.personId,
    })

    useEffect(() => {
        if (query.error && query.error.problem?.status === 404) {
            // Naviger til rot-nivået hvis API-et returnerer 404
            router.push('/')
        }
    }, [query.error, router])

    return query
}
