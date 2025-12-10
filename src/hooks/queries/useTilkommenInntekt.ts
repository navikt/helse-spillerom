import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { TilkommenInntektResponse, tilkommenInntektResponseSchema } from '@schemas/tilkommenInntekt'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

export function useTilkommenInntekt(behandlingId?: string) {
    const { personId, saksbehandlingsperiodeId } = useRouteParams()
    const behandlingIdFaktisk = behandlingId ?? saksbehandlingsperiodeId

    return useQuery<TilkommenInntektResponse[], Error>({
        queryKey: queryKeys.tilkommenInntekt(personId, behandlingIdFaktisk),
        queryFn: async () => {
            return await fetchAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingIdFaktisk}/tilkommeninntekt`,
                z.array(tilkommenInntektResponseSchema),
            )
        },
        enabled: Boolean(personId && behandlingIdFaktisk),
    })
}
