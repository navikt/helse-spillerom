import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { InntektsmeldingSchema } from '@schemas/inntektsmelding'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

const InntektsmeldingerResponseSchema = z.array(InntektsmeldingSchema)

type InntektsmeldingerResponse = z.infer<typeof InntektsmeldingerResponseSchema>

export function useInntektsmeldinger(yrkesaktivitetId: string) {
    const { personId, behandlingId } = useRouteParams()

    return useQuery({
        queryKey: queryKeys.inntektsmeldinger(personId, behandlingId, yrkesaktivitetId),
        queryFn: async (): Promise<InntektsmeldingerResponse> => {
            if (!personId || !behandlingId || !yrkesaktivitetId) {
                throw new Error('PersonId, behandlingId og yrkesaktivitetId må være tilstede')
            }

            const response = await fetch(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/yrkesaktivitet/${yrkesaktivitetId}/inntektsmeldinger`,
            )

            if (!response.ok) {
                throw new Error('Kunne ikke hente inntektsmeldinger')
            }

            const data = await response.json()
            return InntektsmeldingerResponseSchema.parse(data)
        },
        enabled: !!personId && !!behandlingId && !!yrkesaktivitetId,
    })
}
