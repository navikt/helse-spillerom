import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { TilkommenInntektResponse, tilkommenInntektResponseSchema } from '@schemas/tilkommenInntekt'
import { queryKeys } from '@utils/queryKeys'

export function useTilkommenInntekt(behandlingId?: string) {
    const params = useParams()
    const personId = params.personId as string
    const behandlingIdFaktisk = behandlingId ?? (params.saksbehandlingsperiodeId as string)

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
