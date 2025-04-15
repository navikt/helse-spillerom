import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { Behandling } from '@typer/manuellbehandlingtypes'

export function useBehandling() {
    const params = useParams()
    const router = useRouter()

    return useQuery<Behandling, Error>({
        queryKey: ['behandling', params.aktorId, params.behandlingId],
        queryFn: async () => {
            const res = await fetch(`/api/${params.aktorId}/behandling/${params.behandlingId}`, {
                method: 'GET',
            })

            if (res.status === 404) {
                router.push('/')
                // Kast en feil for å avbryte queryen etter redirect.
                throw new Error('Not Found')
            }

            if (!res.ok) {
                throw new Error('An error occurred while fetching the data')
            }

            return (await res.json()) as Behandling
        },
    })
}
