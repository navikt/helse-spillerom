import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@/utils/ProblemDetailsError'
import { Vilkaarsvurdering, vilkaarsvurderingSchema } from '@/schemas/vilkaarsvurdering'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

export function useVilkaarsvurderinger() {
    const { personId, saksbehandlingsperiodeId } = useRouteParams()

    return useQuery<Vilkaarsvurdering[], ProblemDetailsError>({
        queryKey: queryKeys.vilkaarsvurderinger(personId, saksbehandlingsperiodeId),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeId}/vilkaarsvurdering`,
                z.array(vilkaarsvurderingSchema),
            ),
        enabled: !!personId && !!saksbehandlingsperiodeId,
    })
}
