import { useQuery } from '@tanstack/react-query'

import { Beregningsregelverk } from '@/schemas/beregningsregler'

export function useBeregningsregler() {
    return useQuery<Beregningsregelverk>({
        queryKey: ['beregningsregler'],
        queryFn: async () => {
            const response = await fetch('/api/v2/beregningsregler')
            if (!response.ok) {
                throw new Error('Kunne ikke hente beregningsregler')
            }
            return response.json()
        },
        staleTime: 5 * 60 * 1000, // 5 minutter
    })
}
