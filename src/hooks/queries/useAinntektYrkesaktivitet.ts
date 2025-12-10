import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { arbeidstakerAinntektSchema, frilanserAinntektSchema } from '@schemas/inntektData'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

const ainntektSuccessResponseSchema = z.object({
    success: z.literal(true),
    data: z.discriminatedUnion('inntektstype', [arbeidstakerAinntektSchema, frilanserAinntektSchema]),
})

const ainntektErrorResponseSchema = z.object({
    success: z.literal(false),
    feilmelding: z.string(),
})

const ainntektResponseSchema = z.discriminatedUnion('success', [
    ainntektSuccessResponseSchema,
    ainntektErrorResponseSchema,
])

export type AinntektResponse = z.infer<typeof ainntektResponseSchema>

export function useAinntektYrkesaktivitet(yrkesaktivitetId: string, enabled: boolean = true) {
    const { personId, behandlingId } = useRouteParams()

    return useQuery({
        queryKey: queryKeys.ainntektYrkesaktivitet(personId, behandlingId, yrkesaktivitetId),
        queryFn: async (): Promise<AinntektResponse> => {
            if (!personId || !behandlingId || !yrkesaktivitetId) {
                throw new Error('PersonId, behandlingId og yrkesaktivitetId må være tilstede')
            }

            const response = await fetch(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/yrkesaktivitet/${yrkesaktivitetId}/ainntekt`,
            )

            if (!response.ok) {
                throw new Error('Kunne ikke hente a-inntekt')
            }

            const data = await response.json()
            return ainntektResponseSchema.parse(data)
        },
        enabled: enabled && !!personId && !!behandlingId && !!yrkesaktivitetId,
    })
}
