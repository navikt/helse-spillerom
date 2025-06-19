import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { z } from 'zod'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Vilkaarsvurdering, vilkaarsvurderingSchema } from '@/schemas/vilkaarsvurdering'

export function useVilkaarsvurderinger() {
    const params = useParams()
    const router = useRouter()

    const query = useQuery<Vilkaarsvurdering[], ProblemDetailsError>({
        queryKey: [params.personId, 'vilkaarsvurderinger', params.saksbehandlingsperiodeId],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/vilkaar`,
                z.array(vilkaarsvurderingSchema),
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
