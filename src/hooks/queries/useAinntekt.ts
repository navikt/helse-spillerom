import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export function useAinntekt() {
    const params = useParams()
    const fom = '2020-01'
    const tom = '2025-02'
    const personId = params.personId

    return useQuery({
        queryKey: ['ainntekt', personId, fom, tom],
        queryFn: async () => {
            if (!personId) return null
            const response = await fetch(`/api/bakrommet/v1/${personId}/ainntekt?fom=${fom}&tom=${tom}`)
            if (!response.ok) {
                throw new Error('Failed to fetch A-inntekt')
            }
            return response.json()
        },
        enabled: !!personId,
    })
}
