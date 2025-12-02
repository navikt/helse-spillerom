import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { Dokument, dokumentSchema } from '@/schemas/dokument'

export function useHentAinntektDokument828() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Dokument, Error>({
        mutationFn: async () => {
            return await postAndParse(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/dokumenter/ainntekt/hent-8-28`,
                dokumentSchema,
                undefined,
            )
        },
        onSuccess: (nyttDokument: Dokument) => {
            // Oppdater dokumenter-cachen direkte uten invalidering
            const queryKey = ['dokumenter', params.personId, params.saksbehandlingsperiodeId]

            queryClient.setQueryData<Dokument[]>(queryKey, (existingDokumenter = []) => {
                // Legg det nye dokumentet øverst i listen
                return [nyttDokument, ...existingDokumenter]
            })
        },
    })
}

export function useHentAinntektDokument830() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Dokument, Error>({
        mutationFn: async () => {
            return await postAndParse(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/dokumenter/ainntekt/hent-8-30`,
                dokumentSchema,
                undefined,
            )
        },
        onSuccess: (nyttDokument: Dokument) => {
            // Oppdater dokumenter-cachen direkte uten invalidering
            const queryKey = ['dokumenter', params.personId, params.saksbehandlingsperiodeId]

            queryClient.setQueryData<Dokument[]>(queryKey, (existingDokumenter = []) => {
                // Legg det nye dokumentet øverst i listen
                return [nyttDokument, ...existingDokumenter]
            })
        },
    })
}
