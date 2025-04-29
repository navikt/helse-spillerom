import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { fetchAndParse } from '@utils/fetch'
import { Dokument, dokumentSchema } from '@/schemas/dokument'

export function useDokumenter() {
    const params = useParams()

    return useQuery<Dokument[], Error>({
        queryKey: ['dokumenter', params.personId],
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/${params.personId}/dokumenter`, z.array(dokumentSchema)),
    })
}
