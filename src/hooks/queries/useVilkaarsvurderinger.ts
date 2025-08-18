import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@/utils/ProblemDetailsError'
import { Vilkaarsvurdering, vilkaarsvurderingSchema } from '@/schemas/vilkaarsvurdering'

export function useVilkaarsvurderinger() {
    const params = useParams()

    return useQuery<Vilkaarsvurdering[], ProblemDetailsError>({
        queryKey: [params.personId, 'vilkaarsvurderinger', params.saksbehandlingsperiodeId],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/vilkaarsvurdering`,
                z.array(vilkaarsvurderingSchema),
            ),
        enabled: !!params.personId && !!params.saksbehandlingsperiodeId,
    })
}
