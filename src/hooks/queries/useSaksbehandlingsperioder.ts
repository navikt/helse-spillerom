import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { z } from 'zod'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'

export function useAlleSaksbehandlingsperioder() {
    return useQuery<Saksbehandlingsperiode[], ProblemDetailsError>({
        queryKey: ['alle-saksbehandlingsperioder'],
        queryFn: () =>
            fetchAndParse(`/api/bakrommet/v1/saksbehandlingsperioder`, z.array(saksbehandlingsperiodeSchema)),
    })
}

export function useSaksbehandlingsperioder() {
    const params = useParams()
    const router = useRouter()

    const query = useQuery<Saksbehandlingsperiode[], ProblemDetailsError>({
        queryKey: ['saksbehandlingsperioder', params.personId],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder`,
                z.array(saksbehandlingsperiodeSchema),
            ),
        enabled: !!params.personId,
    })

    useEffect(() => {
        if (query.error && query.error.problem.status === 404) {
            // Naviger til rot-nivået hvis API-et returnerer 404
            router.push('/')
        }
    }, [query.error, router])

    return query
}
