'use client'

import { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'
import { DownloadIcon } from '@navikt/aksel-icons'

import { useHentArbeidsforholdDokument } from '@/hooks/mutations/useHentArbeidsforholdDokument'
import { useDokumenter } from '@/hooks/queries/useDokumenter'

export function ArbeidsforholdKnapp(): ReactElement | null {
    const hentArbeidsforholdDokument = useHentArbeidsforholdDokument()
    const { data: dokumenter } = useDokumenter()

    // Skjul knappen hvis det allerede finnes et arbeidsforhold-dokument
    const harArbeidsforholdDokument = dokumenter?.some((dokument) => dokument.dokumentType === 'arbeidsforhold')
    if (harArbeidsforholdDokument) {
        return null
    }

    const handleHentArbeidsforhold = () => {
        hentArbeidsforholdDokument.mutate()
    }

    return (
        <div className="inline-block">
            <Button
                variant="tertiary"
                size="small"
                onClick={handleHentArbeidsforhold}
                loading={hentArbeidsforholdDokument.isPending}
                aria-label="Last ned arbeidsforhold som dokument"
                icon={<DownloadIcon aria-hidden />}
            >
                Arbeidsforhold
            </Button>
        </div>
    )
}
