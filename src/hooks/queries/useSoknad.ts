import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { fetchAndParse } from '@utils/fetch'
import { Søknad, søknadSchema } from '@/schemas/søknad'

export function useSoknad(soknadIdParam?: string) {
    const params = useParams()

    const soknadId = soknadIdParam ?? params.soknadId

    return useQuery<Søknad, Error>({
        queryKey: ['soknad', params.personId, soknadId],
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/${params.personId}/soknader/${soknadId}`, søknadSchema),
        enabled: Boolean(params.personId && soknadId),
    })
}
