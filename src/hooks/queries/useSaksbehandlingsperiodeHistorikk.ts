import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { SaksbehandlingsperiodeEndring, saksbehandlingsperiodeEndringSchema } from '@/schemas/saksbehandlingsperiode'
import { queryKeys } from '@utils/queryKeys'

export function useSaksbehandlingsperiodeHistorikk() {
    const params = useParams()

    return useQuery<SaksbehandlingsperiodeEndring[], ProblemDetailsError>({
        queryKey: queryKeys.saksbehandlingsperiodeHistorikk(
            params.personId as string,
            params.saksbehandlingsperiodeId as string,
        ),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/historikk`,
                z.array(saksbehandlingsperiodeEndringSchema),
            ),
        enabled: Boolean(params.personId && params.saksbehandlingsperiodeId),
    })
}
