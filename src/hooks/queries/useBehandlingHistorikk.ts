import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { BehandlingEndring, behandlingEndringSchema } from '@schemas/behandling'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

export function useBehandlingHistorikk() {
    const { pseudoId, behandlingId } = useRouteParams()

    return useQuery<BehandlingEndring[], ProblemDetailsError>({
        queryKey: queryKeys.behandlingHistorikk(pseudoId, behandlingId),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/historikk`,
                z.array(behandlingEndringSchema),
            ),
        enabled: Boolean(pseudoId && behandlingId),
    })
}
