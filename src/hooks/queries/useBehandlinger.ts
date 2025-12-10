import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Behandling, behandlingSchema } from '@schemas/behandling'
import { queryKeys } from '@utils/queryKeys'
import { usePersonRouteParams } from '@hooks/useRouteParams'

export function useAlleBehandlinger() {
    return useQuery<Behandling[], ProblemDetailsError>({
        queryKey: queryKeys.alleBehandlinger(),
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/behandlinger`, z.array(behandlingSchema)),
    })
}

export function useBehandlinger() {
    const { pseudoId } = usePersonRouteParams()
    const router = useRouter()

    const query = useQuery<Behandling[], ProblemDetailsError>({
        queryKey: queryKeys.behandlinger(pseudoId),
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/${pseudoId}/behandlinger`, z.array(behandlingSchema)),
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
