'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { Personinfo, personinfoSchema } from '@/schemas/personinfo'

export function usePersoninfo() {
    const params = useParams()

    return useQuery<Personinfo, Error>({
        queryKey: ['personinfo', params.personId],
        queryFn: async () => {
            const personInfoJson = await (
                await fetch(`/api/bakrommet/v1/${params.personId}/personinfo`, {
                    method: 'GET',
                })
            ).json()

            return personinfoSchema.parse(personInfoJson)
        },
    })
}
