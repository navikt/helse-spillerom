import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchAndParse } from '@utils/fetch'
import { Vilkaarsvurdering, vilkaarsvurderingSchema, Vurdering } from '@/schemas/vilkaarsvurdering'

type MutationProps = {
    kode: string
    vurdering: Vurdering
    begrunnelse: string
}

export function useOpprettVilkaarsvurdering() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Vilkaarsvurdering, Error, MutationProps>({
        mutationFn: async ({ kode, vurdering, begrunnelse }) => {
            return await fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/vilkaar/${kode}`,
                vilkaarsvurderingSchema,
                {
                    method: 'PUT',
                    body: JSON.stringify({ vurdering, begrunnelse }),
                },
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'vilkaarsvurderinger', params.saksbehandlingsperiodeId],
            })
        },
    })
}
