'use client'

import { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'
import { DownloadIcon } from '@navikt/aksel-icons'

import { useHentPensjonsgivendeInntektDokument } from '@/hooks/mutations/useHentPensjonsgivendeInntektDokument'
import { useDokumenter } from '@/hooks/queries/useDokumenter'
import { useBrukerRoller } from '@/hooks/queries/useBrukerRoller'

export function PensjonsgivendeInntektKnapp(): ReactElement | null {
    const hentPensjonsgivendeInntektDokument = useHentPensjonsgivendeInntektDokument()
    const { data: dokumenter } = useDokumenter()
    const { data: brukerRoller } = useBrukerRoller()

    // Only show button if user has saksbehandler role
    if (!brukerRoller.saksbehandler) {
        return null
    }

    // Skjul knappen hvis det allerede finnes et pensjonsgivende inntekt-dokument
    const harPensjonsgivendeInntektDokument = dokumenter?.some(
        (dokument) => dokument.dokumentType === 'pensjonsgivendeinntekt',
    )
    if (harPensjonsgivendeInntektDokument) {
        return null
    }

    const handleHentPensjonsgivendeInntekt = () => {
        hentPensjonsgivendeInntektDokument.mutate()
    }

    return (
        <div className="inline-block">
            <Button
                variant="tertiary"
                size="small"
                onClick={handleHentPensjonsgivendeInntekt}
                loading={hentPensjonsgivendeInntektDokument.isPending}
                aria-label="Last ned pensjonsgivende inntekt som dokument"
                icon={<DownloadIcon aria-hidden />}
            >
                Pensjonsgivende inntekt
            </Button>
        </div>
    )
}
