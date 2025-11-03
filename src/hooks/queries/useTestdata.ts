import { useQuery } from '@tanstack/react-query'

import { Personinfo } from '@schemas/personinfo'

export function useTestdata() {
    return useQuery<Person[], Error>({
        queryKey: ['testdata'],
        queryFn: async () => {
            return (await fetch(`/api/testdata`)).json()
        },
    })
}
export interface Person {
    fnr: string
    personId: string
    personinfo: Personinfo
}
