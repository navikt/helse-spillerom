import { useQuery } from '@tanstack/react-query'

import { fetchAndParse } from '@utils/fetch'
import { Søknad, søknadSchema } from '@/schemas/søknad'
import { queryKeys } from '@utils/queryKeys'
import { usePersonSoknadRouteParams } from '@hooks/useRouteParams'

export function useSoknad(soknadIdParam?: string) {
    const { pseudoId, soknadId: soknadIdFromParams } = usePersonSoknadRouteParams()
    const soknadId = soknadIdParam ?? soknadIdFromParams

    return useQuery<Søknad, Error>({
        queryKey: queryKeys.soknad(pseudoId, soknadId),
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/${pseudoId}/soknader/${soknadId}`, søknadSchema),
        enabled: Boolean(pseudoId && soknadId),
    })
}
