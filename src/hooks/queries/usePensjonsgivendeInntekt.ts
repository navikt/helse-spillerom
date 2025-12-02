import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { z } from 'zod'

import { inaktivPensjonsgivendeSchema, selvstendigNæringsdrivendePensjonsgivendeSchema } from '@schemas/inntektData'

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
    const params = useParams()
    const personId = params?.personId as string
    const saksbehandlingsperiodeId = params?.saksbehandlingsperiodeId as string

    return useQuery({
        queryKey: ['pensjonsgivendeinntekt', personId, saksbehandlingsperiodeId, yrkesaktivitetId],
        queryFn: async (): Promise<PensjonsgivendeInntektResponse> => {
            if (!personId || !saksbehandlingsperiodeId || !yrkesaktivitetId) {
                throw new Error('PersonId, saksbehandlingsperiodeId og yrkesaktivitetId må være tilstede')
            }

            const response = await fetch(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/pensjonsgivendeinntekt`,
            )

            if (!response.ok) {
                throw new Error('Kunne ikke hente pensjonsgivende inntekt')
            }

            const data = await response.json()
            return pensjonsgivendeInntektResponseSchema.parse(data)
        },
        enabled: enabled && !!personId && !!saksbehandlingsperiodeId && !!yrkesaktivitetId,
    })
}
