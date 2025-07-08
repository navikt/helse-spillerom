import { useQuery } from '@tanstack/react-query'

import { Kodeverk } from '@schemas/kodeverkV2'

export function useKodeverkV2() {
    return useQuery<Kodeverk, Error>({
        queryKey: ['kodeverk-v2'],
        queryFn: async () => {
            const response = await fetch(`/api/v2/kodeverk`)
            const data = await response.json()

            // Sjekk om responsen er en feilmelding
            if (!response.ok || !Array.isArray(data)) {
                throw new Error(data?.message || `Feil ved henting av kodeverk: ${response.status}`)
            }

            return data
        },
    })
}
