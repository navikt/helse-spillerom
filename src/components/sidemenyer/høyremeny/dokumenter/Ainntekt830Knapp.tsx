'use client'

import { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'
import { DownloadIcon } from '@navikt/aksel-icons'

import { useHentAinntektDokument830 } from '@/hooks/mutations/useHentAinntektDokument'
import { useDokumenter } from '@/hooks/queries/useDokumenter'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'

export function Ainntekt830Knapp(): ReactElement | null {
    const hentAinntektDokument = useHentAinntektDokument830()
    const { data: dokumenter } = useDokumenter()
    const kanSaksbehandles = useKanSaksbehandles()

    // Only show button if user has saksbehandler role
    if (!kanSaksbehandles) {
        return null
    }
    // Skjul knappen hvis det allerede finnes et ainntekt-dokument
    const harAinntektDokument = dokumenter?.some((dokument) => dokument.dokumentType === 'ainntekt830')
    if (harAinntektDokument) {
        return null
    }

    return (
        <div className="inline-block">
            <Button
                variant="tertiary"
                size="small"
                onClick={() => {
                    hentAinntektDokument.mutate()
                }}
                loading={hentAinntektDokument.isPending}
                aria-label="Last ned A-inntekt som dokument"
                icon={<DownloadIcon aria-hidden />}
            >
                A-inntekt 8-30
            </Button>
        </div>
    )
}
