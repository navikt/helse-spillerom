import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { tilkommenInntektResponseSchema, TilkommenInntektResponse } from '@schemas/tilkommenInntekt'

export function useTilkommenInntektById() {
    const params = useParams()
    const personId = params.personId as string
    const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string
    const tilkommenInntektId = params.tilkommenId as string

    return useQuery<TilkommenInntektResponse, Error>({
        queryKey: ['tilkommenInntekt', personId, saksbehandlingsperiodeId, tilkommenInntektId],
        queryFn: async () => {
            // Hent alle tilkomne inntekter og finn den med riktig ID
            const alle = await fetchAndParse(
                `/api/bakrommet/v1/${personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/tilkommeninntekt`,
                z.array(tilkommenInntektResponseSchema),
            )
            const funnet = alle.find((ti) => ti.id === tilkommenInntektId)
            if (!funnet) {
                throw new Error(`Fant ikke tilkommen inntekt med id ${tilkommenInntektId}`)
            }
            return funnet
        },
        enabled: Boolean(personId && saksbehandlingsperiodeId && tilkommenInntektId),
    })
}
