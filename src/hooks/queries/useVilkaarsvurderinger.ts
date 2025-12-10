import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@/utils/ProblemDetailsError'
import { Vilkaarsvurdering, vilkaarsvurderingSchema } from '@/schemas/vilkaarsvurdering'
import { queryKeys } from '@utils/queryKeys'

export function useVilkaarsvurderinger() {
    const params = useParams()

    return useQuery<Vilkaarsvurdering[], ProblemDetailsError>({
        queryKey: queryKeys.vilkaarsvurderinger(params.personId as string, params.saksbehandlingsperiodeId as string),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/vilkaarsvurdering`,
                z.array(vilkaarsvurderingSchema),
            ),
        enabled: !!params.personId && !!params.saksbehandlingsperiodeId,
    })
}
