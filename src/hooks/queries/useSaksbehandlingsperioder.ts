import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Saksbehandlingsperiode, saksbehandlingsperiodeSchema } from '@/schemas/saksbehandlingsperiode'

export function useSaksbehandlingsperioder() {
    const params = useParams()

    return useQuery<Saksbehandlingsperiode[], ProblemDetailsError>({
        queryKey: ['saksbehandlingsperioder', params.personId],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder`,
                z.array(saksbehandlingsperiodeSchema),
            ),
        enabled: !!params.personId,
    })
}
