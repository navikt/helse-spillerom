import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { Yrkesaktivitet, yrkesaktivitetSchema } from '@schemas/yrkesaktivitet'
import { YrkesaktivitetKategorisering } from '@schemas/yrkesaktivitetKategorisering'
import { invaliderYrkesaktivitetRelaterteQueries } from '@utils/queryInvalidation'

type MutationProps = {
    kategorisering: YrkesaktivitetKategorisering
}

export function useOpprettYrkesaktivitet() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Yrkesaktivitet, Error, MutationProps>({
        mutationFn: async ({ kategorisering }) => {
            return await postAndParse(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/yrkesaktivitet`,
                yrkesaktivitetSchema,
                {
                    kategorisering,
                },
            )
        },
        onSuccess: () => {
            const personId = params.personId as string
            const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string
            invaliderYrkesaktivitetRelaterteQueries(queryClient, personId, saksbehandlingsperiodeId)
        },
    })
}
