import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { Dokument, dokumentSchema } from '@/schemas/dokument'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

export function useDokumenter() {
    const { personId, saksbehandlingsperiodeId } = useRouteParams()

    return useQuery<Dokument[], Error>({
        queryKey: queryKeys.dokumenter(personId, saksbehandlingsperiodeId),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeId}/dokumenter`,
                z.array(dokumentSchema),
            ),
        enabled: Boolean(personId && saksbehandlingsperiodeId),
    })
}
