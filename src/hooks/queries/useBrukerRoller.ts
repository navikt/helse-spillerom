import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Bruker, brukerSchema, Rolle } from '@/schemas/bruker'
import { erLokalEllerDemo } from '@/env'
import { fetchAndParse } from '@utils/fetch'

type BrukerRoller = {
    leserolle: boolean
    saksbehandler: boolean
    beslutter: boolean
}

interface RolleApiResponse {
    bruker: Bruker
    roller: Rolle[]
}

export function useBrukerRoller() {
    const { data: rolleData } = useQuery<RolleApiResponse>({
        queryKey: ['aktiv-bruker'],
        queryFn: async () => {
            if (erLokalEllerDemo) {
                const response = await fetch('/api/rolle')
                if (!response.ok) {
                    throw new Error('Feil ved henting av aktiv bruker')
                }
                return response.json()
            }
            // TODO: Snakke med Håvard om dette
            const bruker = await fetchAndParse('/api/bakrommet/v1/bruker', brukerSchema)
            return {
                bruker: bruker,
                roller: bruker.roller,
            }
        },
    })

    const data: BrukerRoller = useMemo(
        () => ({
            leserolle: rolleData?.roller?.includes('LES') ?? false,
            saksbehandler: rolleData?.roller?.includes('SAKSBEHANDLER') ?? false,
            beslutter: rolleData?.roller?.includes('BESLUTTER') ?? false,
        }),
        [rolleData?.roller],
    )

    return {
        data,
        aktivBruker: rolleData?.bruker,
    }
}
