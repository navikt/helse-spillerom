import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Inntektsforhold, inntektsforholdSchema } from '@/schemas/inntektsforhold'

export function useInntektsforhold() {
    const params = useParams()

    return useQuery<Inntektsforhold[], ProblemDetailsError>({
        queryKey: [params.personId, 'inntektsforhold', params.saksbehandlingsperiodeId],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/inntektsforhold`,
                z.array(inntektsforholdSchema),
            ),
        enabled: !!params.personId && !!params.saksbehandlingsperiodeId,
    })
}
