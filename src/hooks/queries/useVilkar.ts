import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { Vilkarsvurdering } from '@typer/manuellbehandlingtypes'

export function useVilkar() {
    const params = useParams()

    return useQuery<Vilkarsvurdering[], Error>({
        queryKey: ['vilkar', params.aktorId, params.behandlingId],
        queryFn: async () => {
            return (await (
                await fetch(`/api/${params.aktorId}/behandling/${params.behandlingId}/vilkar`, {
                    method: 'GET',
                })
            ).json()) as Vilkarsvurdering[]
        },
    })
}
