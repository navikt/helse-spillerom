import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { Søknad, søknadSchema } from '@/schemas/søknad'
import { fetchAndParse } from '@utils/fetch'

export function useSoknader() {
    const params = useParams()

    return useQuery<Søknad[], Error>({
        queryKey: ['soknader', params.personId],
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/${params.personId}/soknader`, z.array(søknadSchema)),
    })
}
