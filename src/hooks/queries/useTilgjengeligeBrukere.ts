import { useQuery } from '@tanstack/react-query'

import { Bruker, brukerSchema } from '@/schemas/bruker'
import { fetchAndParse } from '@utils/fetch'
import { queryKeys } from '@utils/queryKeys'

export function useTilgjengeligeBrukere() {
    return useQuery<Bruker[], Error>({
        queryKey: queryKeys.tilgjengeligeBrukere(),
        queryFn: async () => fetchAndParse('/api/bakrommet/v1/demo/brukere', brukerSchema.array()),
    })
}
