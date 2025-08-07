import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@/utils/ProblemDetailsError'
import { VilkaarsvurderingV2, vilkaarsvurderingV2Schema } from '@/schemas/vilkaarsvurdering'

export function useVilkaarsvurderingerV2() {
    const params = useParams()

    return useQuery<VilkaarsvurderingV2[], ProblemDetailsError>({
        queryKey: [params.personId, 'vilkaarsvurderinger-v2', params.saksbehandlingsperiodeId],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/vilkaar`,
                z.array(vilkaarsvurderingV2Schema),
            ),
        enabled: !!params.personId && !!params.saksbehandlingsperiodeId,
    })
}
