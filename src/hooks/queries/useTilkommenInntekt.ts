import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { tilkommenInntektResponseSchema, TilkommenInntektResponse } from '@schemas/tilkommenInntekt'

export function useTilkommenInntekt() {
    const params = useParams()
    const personId = params.personId as string
    const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string

    return useQuery<TilkommenInntektResponse[], Error>({
        queryKey: ['tilkommenInntekt', personId, saksbehandlingsperiodeId],
        queryFn: async () => {
            return await fetchAndParse(
                `/api/bakrommet/v1/${personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/tilkommeninntekt`,
                z.array(tilkommenInntektResponseSchema),
            )
        },
        enabled: Boolean(personId && saksbehandlingsperiodeId),
    })
}
