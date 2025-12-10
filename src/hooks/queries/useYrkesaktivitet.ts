import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Yrkesaktivitet, yrkesaktivitetSchema } from '@schemas/yrkesaktivitet'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

export function useYrkesaktivitet() {
    const { personId, behandlingId } = useRouteParams()
    const router = useRouter()

    const query = useQuery<Yrkesaktivitet[], ProblemDetailsError>({
        queryKey: queryKeys.yrkesaktivitet(personId, behandlingId),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/yrkesaktivitet`,
                z.array(yrkesaktivitetSchema),
            ),
        enabled: !!personId && !!behandlingId,
    })

    useEffect(() => {
        if (query.error && query.error.problem?.status === 404) {
            // Naviger til rot-nivået hvis API-et returnerer 404
            router.push('/')
        }
    }, [query.error, router])

    return query
}
