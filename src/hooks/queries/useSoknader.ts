'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { Søknad, søknadSchema } from '@/schemas/søknad'

export function useSoknader() {
    const params = useParams()

    return useQuery<Søknad[], Error>({
        queryKey: ['soknader', params.personId],
        queryFn: async () => {
            const json = await (
                await fetch(`/api/bakrommet/v1/${params.personId}/soknader`, {
                    method: 'GET',
                })
            ).json()

            return z.array(søknadSchema).parse(json)
        },
    })
}
