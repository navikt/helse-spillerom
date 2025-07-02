import { useQuery } from '@tanstack/react-query'

import { Kodeverk } from '@components/saksbilde/vilkårsvurdering/kodeverk'

export function useKodeverk() {
    return useQuery<Kodeverk, Error>({
        queryKey: ['kodeverk'],
        queryFn: async () => {
            const response = await fetch(`/api/v1/kodeverk`)
            const data = await response.json()

            // Sjekk om responsen er en feilmelding
            if (!response.ok || !Array.isArray(data)) {
                throw new Error(data?.message || `Feil ved henting av kodeverk: ${response.status}`)
            }

            return data
        },
    })
}
