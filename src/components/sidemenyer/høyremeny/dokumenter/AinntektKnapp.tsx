'use client'

import { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'
import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { useHentAinntektDokument } from '@/hooks/mutations/useHentAinntektDokument'
import { Dokument } from '@/schemas/dokument'

const NYLIG_OPPRETTET_DOKUMENT_KEY = 'nyligOpprettetDokument'

export function AinntektKnapp(): ReactElement {
    const params = useParams()
    const queryClient = useQueryClient()
    const hentAinntektDokument = useHentAinntektDokument()

    const handleHentAinntekt = () => {
        // Hent A-inntekt for siste 12 måneder som default
        const tom = new Date()
        const fom = new Date()
        fom.setFullYear(tom.getFullYear() - 1)

        const fomString = `${fom.getFullYear()}-${String(fom.getMonth() + 1).padStart(2, '0')}`
        const tomString = `${tom.getFullYear()}-${String(tom.getMonth() + 1).padStart(2, '0')}`

        hentAinntektDokument.mutate(
            { fom: fomString, tom: tomString },
            {
                onSuccess: (nyttDokument: Dokument) => {
                    // Oppdater dokumenter-cachen direkte uten invalidering
                    const queryKey = ['dokumenter', params.personId, params.saksbehandlingsperiodeId]

                    queryClient.setQueryData<Dokument[]>(queryKey, (existingDokumenter = []) => {
                        // Legg det nye dokumentet øverst i listen
                        return [nyttDokument, ...existingDokumenter]
                    })

                    // Marker dokumentet for automatisk åpning
                    localStorage.setItem(NYLIG_OPPRETTET_DOKUMENT_KEY, nyttDokument.id)
                },
            },
        )
    }

    return (
        <div className="inline-block">
            <Button
                variant="tertiary"
                size="small"
                onClick={handleHentAinntekt}
                loading={hentAinntektDokument.isPending}
                aria-label="Hent A-inntekt som dokument"
                icon={<ExternalLinkIcon aria-hidden />}
            >
                A-inntekt
            </Button>
        </div>
    )
}
