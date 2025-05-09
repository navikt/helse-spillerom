import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Dayjs } from 'dayjs'
import { z } from 'zod'

import { Søknad, søknadSchema } from '@/schemas/søknad'
import { fetchAndParse } from '@utils/fetch'

export function useSoknader(fom: Dayjs) {
    const params = useParams()

    if (!fom.isValid()) {
        throw new Error('Invalid date: fom må være en gyldig Dayjs-dato')
    }

    const formattedFom = fom.format('YYYY-MM-DD')

    return useQuery<Søknad[], Error>({
        // Inkluder personId og fom i cache-nøkkelen
        queryKey: ['soknader', params.personId, formattedFom],
        queryFn: () => {
            const base = `/api/bakrommet/v1/${params.personId}/soknader`
            const url = `${base}?fom=${encodeURIComponent(formattedFom)}`
            return fetchAndParse(url, z.array(søknadSchema))
        },
        enabled: !!params.personId,
    })
}
