import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { fetchAndParse } from '@utils/fetch'
import { pensjonsgivendeInntektSchema, PensjonsgivendeInntekt } from '@schemas/pensjonsgivende'

export function usePensjonsgivendeInntekt() {
    const params = useParams()
    const inntektsaar = new Date().getFullYear() - 1 // Default to last year

    return useQuery<PensjonsgivendeInntekt, Error>({
        queryKey: ['pensjonsgivendeInntekt', params.personId, inntektsaar],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/pensjonsgivendeinntekt?inntektsaar=${inntektsaar}`,
                pensjonsgivendeInntektSchema,
            ),
        enabled: !!params.personId,
    })
}
