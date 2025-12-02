import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { z } from 'zod'

import { InntektsmeldingSchema } from '@schemas/inntektsmelding'

const InntektsmeldingerResponseSchema = z.array(InntektsmeldingSchema)

type InntektsmeldingerResponse = z.infer<typeof InntektsmeldingerResponseSchema>

export function useInntektsmeldinger(yrkesaktivitetId: string) {
    const params = useParams()
    const personId = params?.personId as string
    const saksbehandlingsperiodeId = params?.saksbehandlingsperiodeId as string

    return useQuery({
        queryKey: ['inntektsmeldinger', personId, saksbehandlingsperiodeId, yrkesaktivitetId],
        queryFn: async (): Promise<InntektsmeldingerResponse> => {
            if (!personId || !saksbehandlingsperiodeId || !yrkesaktivitetId) {
                throw new Error('PersonId, saksbehandlingsperiodeId og yrkesaktivitetId må være tilstede')
            }

            const response = await fetch(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/inntektsmeldinger`,
            )

            if (!response.ok) {
                throw new Error('Kunne ikke hente inntektsmeldinger')
            }

            const data = await response.json()
            return InntektsmeldingerResponseSchema.parse(data)
        },
        enabled: !!personId && !!saksbehandlingsperiodeId && !!yrkesaktivitetId,
    })
}
