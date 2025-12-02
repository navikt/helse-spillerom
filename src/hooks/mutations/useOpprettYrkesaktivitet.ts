import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { Yrkesaktivitet, yrkesaktivitetSchema } from '@schemas/yrkesaktivitet'
import { YrkesaktivitetKategorisering } from '@schemas/yrkesaktivitetKategorisering'

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
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'yrkesaktivitet', params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlag', params.personId, params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: ['tidslinje', params.personId],
            })
        },
    })
}
