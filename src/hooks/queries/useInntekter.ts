import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { Inntekt } from '@typer/manuellbehandlingtypes'

export function useInntekter() {
    const params = useParams()

    return useQuery<Inntekt[], Error>({
        queryKey: ['inntekt', params.aktorId, params.behandlingId],
        queryFn: async () => {
            return (await (
                await fetch(`/api/${params.aktorId}/behandling/${params.behandlingId}/inntekt`, {
                    method: 'GET',
                })
            ).json()) as Inntekt[]
        },
    })
}
