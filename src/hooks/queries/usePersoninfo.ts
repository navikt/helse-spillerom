import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { Personinfo, personinfoSchema } from '@/schemas/personinfo'
import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { queryKeys } from '@utils/queryKeys'
import { usePersonRouteParams } from '@hooks/useRouteParams'

export function usePersoninfo() {
    const { personId } = usePersonRouteParams()
    const router = useRouter()

    const query = useQuery<Personinfo, ProblemDetailsError>({
        queryKey: queryKeys.personinfo(personId),
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/${personId}/personinfo`, personinfoSchema),
        enabled: !!personId,
    })

    useEffect(() => {
        if (query.error && query.error.problem?.status === 404) {
            // Naviger til rot-nivået hvis API-et returnerer 404
            router.push('/')
        }
    }, [query.error, router])

    return query
}
