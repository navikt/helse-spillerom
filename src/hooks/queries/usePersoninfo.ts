import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { Personinfo, personinfoSchema } from '@/schemas/personinfo'
import { fetchAndParse } from '@utils/fetch'

export function usePersoninfo() {
    const params = useParams()

    return useQuery<Personinfo, Error>({
        queryKey: ['personinfo', params.personId],
        queryFn: () => fetchAndParse(`/api/bakrommet/v1/${params.personId}/personinfo`, personinfoSchema),
    })
}
