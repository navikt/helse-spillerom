import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { TidslinjeBehandling, tidslinjeBehandlingerSchema } from '@schemas/tidslinje'
import { queryKeys } from '@utils/queryKeys'
import { usePersonRouteParams } from '@hooks/useRouteParams'

export function useTidslinje() {
    const { pseudoId } = usePersonRouteParams()
    const router = useRouter()

    const query = useQuery<TidslinjeBehandling[], ProblemDetailsError>({
        queryKey: queryKeys.tidslinje(pseudoId),
        queryFn: async () => {
            return await fetchAndParse(`/api/bakrommet/v2/${pseudoId}/tidslinje`, tidslinjeBehandlingerSchema)
        },
        enabled: !!pseudoId,
    })

    useEffect(() => {
        if (query.error && query.error.problem?.status === 404) {
            // Naviger til rot-nivået hvis API-et returnerer 404
            router.push('/')
        }
    }, [query.error, router])

    return query
}
