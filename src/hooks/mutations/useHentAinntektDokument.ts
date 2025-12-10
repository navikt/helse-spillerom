import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { Dokument, dokumentSchema } from '@/schemas/dokument'
import { useRouteParams } from '@hooks/useRouteParams'
import { queryKeys } from '@utils/queryKeys'

export function useHentAinntektDokument828() {
    const { personId, saksbehandlingsperiodeId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Dokument, Error>({
        mutationFn: async () => {
            return await postAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeId}/dokumenter/ainntekt/hent-8-28`,
                dokumentSchema,
                undefined,
            )
        },
        onSuccess: (nyttDokument: Dokument) => {
            // Oppdater dokumenter-cachen direkte uten invalidering
            const queryKey = queryKeys.dokumenter(personId, saksbehandlingsperiodeId)

            queryClient.setQueryData<Dokument[]>(queryKey, (existingDokumenter = []) => {
                // Legg det nye dokumentet øverst i listen
                return [nyttDokument, ...existingDokumenter]
            })
        },
    })
}

export function useHentAinntektDokument830() {
    const { personId, saksbehandlingsperiodeId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<Dokument, Error>({
        mutationFn: async () => {
            return await postAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeId}/dokumenter/ainntekt/hent-8-30`,
                dokumentSchema,
                undefined,
            )
        },
        onSuccess: (nyttDokument: Dokument) => {
            // Oppdater dokumenter-cachen direkte uten invalidering
            const queryKey = queryKeys.dokumenter(personId, saksbehandlingsperiodeId)

            queryClient.setQueryData<Dokument[]>(queryKey, (existingDokumenter = []) => {
                // Legg det nye dokumentet øverst i listen
                return [nyttDokument, ...existingDokumenter]
            })
        },
    })
}
