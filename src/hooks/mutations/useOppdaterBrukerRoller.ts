import { useMutation, useQueryClient } from '@tanstack/react-query'

interface OppdaterBrukerRequest {
    navIdent: string
}

export function useOppdaterBrukerRoller() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (request: OppdaterBrukerRequest) => {
            const response = await fetch('/api/rolle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            })

            if (!response.ok) {
                throw new Error('Feil ved oppdatering av bruker')
            }

            return response.json()
        },
        onSuccess: () => {
            // Invalider aktiv bruker query slik at ny bruker hentes
            queryClient.invalidateQueries({ queryKey: ['aktiv-bruker'] })
        },
    })
}
