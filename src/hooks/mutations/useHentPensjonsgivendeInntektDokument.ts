import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { postAndParse } from '@utils/fetch'
import { Dokument, dokumentSchema } from '@/schemas/dokument'

export function useHentPensjonsgivendeInntektDokument() {
    const params = useParams()
    const queryClient = useQueryClient()
    const inntektsaar = new Date().getFullYear() - 1 // Default to last year

    return useMutation<Dokument, Error>({
        mutationFn: async () => {
            return await postAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${params.saksbehandlingsperiodeId}/dokumenter/pensjonsgivendeinntekt/hent?inntektsaar=${inntektsaar}`,
                dokumentSchema,
                {}, // Ingen body i POST
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
