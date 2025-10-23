'use client'

import { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'
import { DownloadIcon } from '@navikt/aksel-icons'

import { useHentAinntektDokument828 } from '@/hooks/mutations/useHentAinntektDokument'
import { useDokumenter } from '@/hooks/queries/useDokumenter'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'

export function Ainntekt828Knapp(): ReactElement | null {
    const hentAinntektDokument = useHentAinntektDokument828()
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

    return (
        <div className="inline-block">
            <Button
                variant="tertiary"
                size="small"
                onClick={() => {
                    hentAinntektDokument.mutate()
                }}
                loading={hentAinntektDokument.isPending}
                aria-label="Last ned A-inntekt 8-28 som dokument"
                icon={<DownloadIcon aria-hidden />}
            >
                A-inntekt 8-28
            </Button>
        </div>
    )
}
