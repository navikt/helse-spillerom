import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { SaksbehandlingsperiodeEndring, saksbehandlingsperiodeEndringSchema } from '@/schemas/saksbehandlingsperiode'

export function useSaksbehandlingsperiodeHistorikk() {
    const params = useParams()

    return useQuery<SaksbehandlingsperiodeEndring[], ProblemDetailsError>({
        queryKey: ['saksbehandlingsperiode-historikk', params.personId, params.saksbehandlingsperiodeId],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/historikk`,
                z.array(saksbehandlingsperiodeEndringSchema),
            ),
        enabled: Boolean(params.personId && params.saksbehandlingsperiodeId),
    })
}
