import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { Personinfo, personinfoSchema } from '@/schemas/personinfo'
import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { queryKeys } from '@utils/queryKeys'

export function usePersoninfo() {
    const params = useParams()
    const router = useRouter()

    const query = useQuery<Personinfo, ProblemDetailsError>({
        queryKey: queryKeys.personinfo(params.personId as string),
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/${params.personId}/personinfo`, personinfoSchema),
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
