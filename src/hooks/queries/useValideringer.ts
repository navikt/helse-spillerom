import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'
import { Validering, valideringSchema } from '@schemas/validering'

export function useValideringer(sluttvalidering: boolean) {
    const { pseudoId, behandlingId } = useRouteParams()

    return useQuery<Validering[], Error>({
        queryKey: queryKeys.valideringer(pseudoId, behandlingId, sluttvalidering),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/validering?inkluderSluttvalidering=${sluttvalidering}`,
                z.array(valideringSchema),
            ),
        enabled: Boolean(pseudoId && behandlingId),
    })
}
