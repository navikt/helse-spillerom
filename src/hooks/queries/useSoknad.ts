import { useQuery } from '@tanstack/react-query'

import { fetchAndParse } from '@utils/fetch'
import { Søknad, søknadSchema } from '@/schemas/søknad'
import { queryKeys } from '@utils/queryKeys'
import { usePersonSoknadRouteParams } from '@hooks/useRouteParams'

export function useSoknad(soknadIdParam?: string) {
    const { personId, soknadId: soknadIdFromParams } = usePersonSoknadRouteParams()
    const soknadId = soknadIdParam ?? soknadIdFromParams

    return useQuery<Søknad, Error>({
        queryKey: queryKeys.soknad(personId, soknadId),
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/${personId}/soknader/${soknadId}`, søknadSchema),
        enabled: Boolean(personId && soknadId),
    })
}
