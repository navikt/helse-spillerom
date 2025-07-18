import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { Dokument, dokumentSchema } from '@/schemas/dokument'

interface AInntektHentRequest {
    fom: string // YearMonth format: "2024-01"
    tom: string // YearMonth format: "2024-12"
}

export function useHentAinntektDokument() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<Dokument, Error, AInntektHentRequest>({
        mutationFn: async ({ fom, tom }) => {
            return await postAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/dokumenter/ainntekt/hent`,
                dokumentSchema,
                { fom, tom },
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
