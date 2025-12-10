import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { Yrkesaktivitet, yrkesaktivitetSchema } from '@schemas/yrkesaktivitet'
import { YrkesaktivitetKategorisering } from '@schemas/yrkesaktivitetKategorisering'
import { invaliderYrkesaktivitetRelaterteQueries } from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

type MutationProps = {
    kategorisering: YrkesaktivitetKategorisering
}

export function useOpprettYrkesaktivitet() {
    const { personId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Yrkesaktivitet, Error, MutationProps>({
        mutationFn: async ({ kategorisering }) => {
            return await postAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${behandlingId}/yrkesaktivitet`,
                yrkesaktivitetSchema,
                {
                    kategorisering,
                },
            )
        },
        onSuccess: () => {
            invaliderYrkesaktivitetRelaterteQueries(queryClient, personId, behandlingId)
        },
    })
}
