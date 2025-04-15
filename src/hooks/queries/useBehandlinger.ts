import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { Behandling } from '@typer/manuellbehandlingtypes'

export function useBehandlinger() {
    const params = useParams()

    return useQuery<Behandling[], Error>({
        queryKey: ['behandling', params.aktorId],
        queryFn: async () => {
            return (await (
                await fetch(`/api/${params.aktorId}/behandling`, {
                    method: 'GET',
                })
            ).json()) as Behandling[]
        },
    })
}
