'use client'

import { useQuery } from '@tanstack/react-query'

import { Bruker, brukerSchema } from '@/schemas/bruker'

export function useBrukerinfo() {
    return useQuery<Bruker, Error>({
        queryKey: ['personinfo'],
        queryFn: async () => {
            const json = await (
                await fetch(`/api/v1/bruker`, {
                    method: 'GET',
                })
            ).json()

            return brukerSchema.parse(json)
        },
    })
}
