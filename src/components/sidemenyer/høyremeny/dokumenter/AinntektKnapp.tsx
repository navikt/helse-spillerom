'use client'

import { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'
import { DownloadIcon } from '@navikt/aksel-icons'

import { useHentAinntektDokument } from '@/hooks/mutations/useHentAinntektDokument'
import { useDokumenter } from '@/hooks/queries/useDokumenter'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'

export function AinntektKnapp(): ReactElement | null {
    const hentAinntektDokument = useHentAinntektDokument()
    const { data: dokumenter } = useDokumenter()
    const kanSaksbehandles = useKanSaksbehandles()

    // Only show button if user has saksbehandler role
    if (!kanSaksbehandles) {
        return null
    }
    // Skjul knappen hvis det allerede finnes et ainntekt-dokument
    const harAinntektDokument = dokumenter?.some((dokument) => dokument.dokumentType === 'ainntekt828')
    if (harAinntektDokument) {
        return null
    }

    const handleHentAinntekt = () => {
        // Hent A-inntekt for siste 12 måneder som default
        const tom = new Date()
        const fom = new Date()
        fom.setFullYear(tom.getFullYear() - 1)

        const fomString = `${fom.getFullYear()}-${String(fom.getMonth() + 1).padStart(2, '0')}`
        const tomString = `${tom.getFullYear()}-${String(tom.getMonth() + 1).padStart(2, '0')}`

        hentAinntektDokument.mutate({ fom: fomString, tom: tomString })
    }

    return (
        <div className="inline-block">
            <Button
                variant="tertiary"
                size="small"
                onClick={handleHentAinntekt}
                loading={hentAinntektDokument.isPending}
                aria-label="Last ned A-inntekt som dokument"
                icon={<DownloadIcon aria-hidden />}
            >
                A-inntekt
            </Button>
        </div>
    )
}
