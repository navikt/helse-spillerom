import { useQuery } from '@tanstack/react-query'

import { Kodeverk } from '@components/saksbilde/vilkårsvurdering/kodeverk'

export function useKodeverk() {
    return useQuery<Kodeverk, Error>({
        queryKey: ['kodeverk'],
        queryFn: async () => {
            return (await fetch(`/api/v1/kodeverk`)).json()
        },
    })
}
