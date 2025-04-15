import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { RSSoknad } from '@typer/soknad'

export function useSoknader() {
    const params = useParams()

    return useQuery<RSSoknad[], Error>({
        queryKey: ['soknad', params.aktorId],
        queryFn: async () => {
            return (await (
                await fetch(`/api/${params.aktorId}/soknad`, {
                    method: 'GET',
                })
            ).json()) as RSSoknad[]
        },
    })
}
