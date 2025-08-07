import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { Dokument, dokumentSchema } from '@/schemas/dokument'

export function useDokumenter() {
    const params = useParams()

    return useQuery<Dokument[], Error>({
        queryKey: ['dokumenter', params.personId, params.saksbehandlingsperiodeId],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/dokumenter`,
                z.array(dokumentSchema),
            ),
        enabled: Boolean(params.personId && params.saksbehandlingsperiodeId),
    })
}
