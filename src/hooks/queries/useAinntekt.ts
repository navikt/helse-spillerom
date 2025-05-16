import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { ainntektSchema, type Ainntekt } from '@/schemas/ainntekt'

export function useAinntekt() {
    const params = useParams()

    const personId = params.personId
    const fom = '2020-01'
    const tom = '2025-02'

    return useQuery<Ainntekt | null>({
        queryKey: ['ainntekt', personId, fom, tom],
        queryFn: async () => {
            if (!personId) return null
            const response = await fetch(`/api/bakrommet/v1/${personId}/ainntekt?fom=${fom}&tom=${tom}`)
            if (!response.ok) {
                throw new Error('Failed to fetch A-inntekt')
            }
            const data = await response.json()
            return ainntektSchema.parse(data)
        },
        enabled: !!personId,
    })
}
