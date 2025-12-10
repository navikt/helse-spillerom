import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { fetchAndParse } from '@utils/fetch'
import { Søknad, søknadSchema } from '@/schemas/søknad'
import { queryKeys } from '@utils/queryKeys'

export function useSoknad(soknadIdParam?: string) {
    const params = useParams()

    const soknadId = soknadIdParam ?? params.soknadId

    return useQuery<Søknad, Error>({
        queryKey: queryKeys.soknad(params.personId as string, soknadId as string),
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/${params.personId}/soknader/${soknadId}`, søknadSchema),
        enabled: Boolean(params.personId && soknadId),
    })
}
