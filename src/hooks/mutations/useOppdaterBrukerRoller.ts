import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Bruker, brukerSchema } from '@/schemas/bruker'
import { postAndParse } from '@utils/fetch'

interface OppdaterBrukerRequest {
    navIdent: string
}

export function useOppdaterBrukerRoller() {
    const queryClient = useQueryClient()

    return useMutation<Bruker, Error, OppdaterBrukerRequest>({
        mutationFn: async (request: OppdaterBrukerRequest) => {
            return postAndParse('/api/bakrommet/v1/demo/bruker', brukerSchema, request)
        },
        onSuccess: () => {
            // Invalider aktiv bruker query slik at ny bruker hentes
            queryClient.invalidateQueries({ queryKey: ['brukerinfo'] })
        },
    })
}
