import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { Dag } from '@typer/manuellbehandlingtypes'

export function useDager(inntektId: string) {
    const params = useParams()

    return useQuery<Dag[], Error>({
        queryKey: ['dager', params.aktorId, params.behandlingId, inntektId],
        queryFn: async () => {
            return (await (
                await fetch(
                    `/api/${params.aktorId}/behandling/${params.behandlingId}/inntekt/${inntektId}/dagoversikt`,
                    {
                        method: 'GET',
                    },
                )
            ).json()) as Dag[]
        },
    })
}
