import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Rolle } from '@/schemas/bruker'

interface OppdaterBrukerRollerRequest {
    roller: Rolle[]
}

export function useOppdaterBrukerRoller() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: OppdaterBrukerRollerRequest) => {
            const response = await fetch('/api/rolle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            })

            if (!response.ok) {
                throw new Error('Feil ved oppdatering av roller')
            }

            return response.json()
        },
        onSuccess: () => {
            // Invalider brukerinfo query slik at nye roller hentes
            queryClient.invalidateQueries({ queryKey: ['brukerinfo'] })
        },
    })
}
