import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { Dokument, dokumentSchema } from '@/schemas/dokument'
import { queryKeys } from '@utils/queryKeys'

export function useDokumenter() {
    const params = useParams()

    return useQuery<Dokument[], Error>({
        queryKey: queryKeys.dokumenter(params.personId as string, params.saksbehandlingsperiodeId as string),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/dokumenter`,
                z.array(dokumentSchema),
            ),
        enabled: Boolean(params.personId && params.saksbehandlingsperiodeId),
    })
}
