import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { z } from 'zod'

import { arbeidstakerAinntektSchema, frilanserAinntektSchema } from '@schemas/inntektData'

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
    const params = useParams()
    const personId = params?.personId as string
    const saksbehandlingsperiodeId = params?.saksbehandlingsperiodeId as string

    return useQuery({
        queryKey: ['ainntekt-yrkesaktivitet', personId, saksbehandlingsperiodeId, yrkesaktivitetId],
        queryFn: async (): Promise<AinntektResponse> => {
            if (!personId || !saksbehandlingsperiodeId || !yrkesaktivitetId) {
                throw new Error('PersonId, saksbehandlingsperiodeId og yrkesaktivitetId må være tilstede')
            }

            const response = await fetch(
                `/api/bakrommet/v1/${personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/ainntekt`,
            )

            if (!response.ok) {
                throw new Error('Kunne ikke hente a-inntekt')
            }

            const data = await response.json()
            return ainntektResponseSchema.parse(data)
        },
        enabled: enabled && !!personId && !!saksbehandlingsperiodeId && !!yrkesaktivitetId,
    })
}
