import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { Arbeidsforhold } from '@typer/aareg'
import { arbeidsforholdSchema } from '@schemas/aareg'
import { fetchAndParse } from '@utils/fetch'

export function useAareg() {
    const params = useParams()

    return useQuery<Arbeidsforhold[], Error>({
        queryKey: ['aareg', params.personId],
        queryFn: () =>
            fetchAndParse(`/api/bakrommet/v1/${params.personId}/arbeidsforhold`, z.array(arbeidsforholdSchema)),
        enabled: !!params.personId,
    })
}
