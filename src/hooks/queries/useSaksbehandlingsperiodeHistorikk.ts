import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { SaksbehandlingsperiodeEndring, saksbehandlingsperiodeEndringSchema } from '@/schemas/saksbehandlingsperiode'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

export function useSaksbehandlingsperiodeHistorikk() {
    const { personId, behandlingId } = useRouteParams()

    return useQuery<SaksbehandlingsperiodeEndring[], ProblemDetailsError>({
        queryKey: queryKeys.saksbehandlingsperiodeHistorikk(personId, behandlingId),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/historikk`,
                z.array(saksbehandlingsperiodeEndringSchema),
            ),
        enabled: Boolean(personId && behandlingId),
    })
}
