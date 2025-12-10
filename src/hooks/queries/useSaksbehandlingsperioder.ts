import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'
import { queryKeys } from '@utils/queryKeys'

export function useAlleSaksbehandlingsperioder() {
    return useQuery<Saksbehandlingsperiode[], ProblemDetailsError>({
        queryKey: queryKeys.alleSaksbehandlingsperioder(),
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/behandlinger`, z.array(saksbehandlingsperiodeSchema)),
    })
}

export function useSaksbehandlingsperioder() {
    const params = useParams()
    const router = useRouter()

    const query = useQuery<Saksbehandlingsperiode[], ProblemDetailsError>({
        queryKey: queryKeys.saksbehandlingsperioder(params.personId as string),
        queryFn: () =>
            fetchAndParse(`/api/bakrommet/v1/${params.personId}/behandlinger`, z.array(saksbehandlingsperiodeSchema)),
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
