import { useQuery } from '@tanstack/react-query'

import { Bruker, brukerSchema } from '@/schemas/bruker'
import { fetchAndParse } from '@utils/fetch'
import { queryKeys } from '@utils/queryKeys'

export function useBrukerinfo() {
    return useQuery<Bruker, Error>({
        queryKey: queryKeys.brukerinfo(),
        queryFn: async () => fetchAndParse('/api/bakrommet/v1/bruker', brukerSchema),
    })
}
