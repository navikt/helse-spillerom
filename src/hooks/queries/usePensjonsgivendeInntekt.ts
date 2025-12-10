import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { inaktivPensjonsgivendeSchema, selvstendigNæringsdrivendePensjonsgivendeSchema } from '@schemas/inntektData'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

const pensjonsgivendeInntektSuccessResponseSchema = z.object({
    success: z.literal(true),
    data: z.discriminatedUnion('inntektstype', [
        inaktivPensjonsgivendeSchema,
        selvstendigNæringsdrivendePensjonsgivendeSchema,
    ]),
})

const pensjonsgivendeInntektErrorResponseSchema = z.object({
    success: z.literal(false),
    feilmelding: z.string(),
})

const pensjonsgivendeInntektResponseSchema = z.discriminatedUnion('success', [
    pensjonsgivendeInntektSuccessResponseSchema,
    pensjonsgivendeInntektErrorResponseSchema,
])

export type PensjonsgivendeInntektResponse = z.infer<typeof pensjonsgivendeInntektResponseSchema>

export function usePensjonsgivendeInntekt(yrkesaktivitetId: string, enabled: boolean = true) {
    const { personId, behandlingId } = useRouteParams()

    return useQuery({
        queryKey: queryKeys.pensjonsgivendeInntekt(personId, behandlingId, yrkesaktivitetId),
        queryFn: async (): Promise<PensjonsgivendeInntektResponse> => {
            if (!personId || !behandlingId || !yrkesaktivitetId) {
                throw new Error('PersonId, behandlingId og yrkesaktivitetId må være tilstede')
            }

            const response = await fetch(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/yrkesaktivitet/${yrkesaktivitetId}/pensjonsgivendeinntekt`,
            )

            if (!response.ok) {
                throw new Error('Kunne ikke hente pensjonsgivende inntekt')
            }

            const data = await response.json()
            return pensjonsgivendeInntektResponseSchema.parse(data)
        },
        enabled: enabled && !!personId && !!behandlingId && !!yrkesaktivitetId,
    })
}
