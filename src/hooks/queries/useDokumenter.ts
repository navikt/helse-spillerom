import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { Dokument, dokumentSchema } from '@/schemas/dokument'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'

export function useDokumenter() {
    const { personId, behandlingId } = useRouteParams()

    return useQuery<Dokument[], Error>({
        queryKey: queryKeys.dokumenter(personId, behandlingId),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/dokumenter`,
                z.array(dokumentSchema),
            ),
        enabled: Boolean(personId && behandlingId),
    })
}
