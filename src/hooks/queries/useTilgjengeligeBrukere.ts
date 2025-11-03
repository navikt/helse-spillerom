import { useQuery } from '@tanstack/react-query'

import { Bruker, brukerSchema } from '@/schemas/bruker'
import { fetchAndParse } from '@utils/fetch'

export function useTilgjengeligeBrukere() {
    return useQuery<Bruker[], Error>({
        queryKey: ['tilgjengeligeBrukere'],
        queryFn: async () => fetchAndParse('/api/bakrommet/v1/demo/brukere', brukerSchema.array()),
    })
}
