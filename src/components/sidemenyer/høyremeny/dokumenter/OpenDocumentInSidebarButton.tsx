import React, { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'

import { getDokumentId, useDokumentVisningContext } from '@/app/person/[pseudoId]/dokumentVisningContext'
import { Inntektsmelding } from '@schemas/inntektsmelding'
import { OpenInSidePanelIcon } from '@components/ikoner/OpenInSidePanelIcon'
import { CloseSidePanelIcon } from '@components/ikoner/CloseSidePanelIcon'
import { Søknad } from '@schemas/søknad'

interface OpenDocumentInSidebarButtonProps {
    dokument: Inntektsmelding | Søknad
    showSelectButton?: boolean
    showText?: boolean
    className?: string
}

export function OpenDocumentInSidebarButton({
    dokument,
    showSelectButton = false,
    showText = true,
    className,
}: OpenDocumentInSidebarButtonProps): ReactElement {
    const { dokumenter, updateDokumenter, updateDokumentState } = useDokumentVisningContext()
    const dokumentId = getDokumentId(dokument)
    const isOpen = dokumenter.some((d) => getDokumentId(d) === dokumentId)

    return (
        <Button
            size="xsmall"
            type="button"
            variant="tertiary"
            icon={
                isOpen ? (
                    <CloseSidePanelIcon aria-hidden fontSize="1.25rem" />
                ) : (
                    <OpenInSidePanelIcon aria-hidden fontSize="1.25rem" />
                )
            }
            iconPosition="right"
            onClick={() => {
                updateDokumentState(dokumentId, { showSelectButton })
                updateDokumenter(dokument)
            }}
            className={className}
        >
            {showText && (isOpen ? 'Skjul' : 'Vis')}
        </Button>
    )
}
