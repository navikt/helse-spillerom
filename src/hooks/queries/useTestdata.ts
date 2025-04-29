import { useQuery } from '@tanstack/react-query'

import { Person } from '@/mock-api/session'

export function useTestdata() {
    return useQuery<Person[], Error>({
        queryKey: ['testdata'],
        queryFn: async () => {
            return (await fetch(`/api/testdata`)).json()
        },
    })
}
