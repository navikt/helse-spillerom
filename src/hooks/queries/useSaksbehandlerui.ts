import { useQuery } from '@tanstack/react-query'

import { HovedspørsmålArray } from '@schemas/saksbehandlergrensesnitt'

export function useSaksbehandlerui() {
    return useQuery<HovedspørsmålArray, Error>({
        queryKey: ['saksbehandlerui'],
        queryFn: async () => {
            const response = await fetch(`/api/v2/saksbehandlerui`)
            const data = await response.json()

            // Sjekk om responsen er en feilmelding
            if (!response.ok || !Array.isArray(data)) {
                throw new Error(data?.message || `Feil ved henting av saksbehandlerui: ${response.status}`)
            }

            return data
        },
    })
}
