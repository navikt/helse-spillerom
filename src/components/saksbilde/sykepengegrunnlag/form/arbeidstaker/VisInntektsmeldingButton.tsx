import React, { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'

import { useDokumentVisningContext } from '@/app/person/[personId]/dokumentVisningContext'
import { Inntektsmelding } from '@schemas/inntektsmelding'
import { OpenInSidePanelIcon } from '@components/ikoner/OpenInSidePanelIcon'
import { CloseSidePanelIcon } from '@components/ikoner/CloseSidePanelIcon'

interface VisInntektsmeldingButtonProps {
    inntektsmelding: Inntektsmelding
    showSelectButton?: boolean
    showText?: boolean
}

export function VisInntektsmeldingButton({
    inntektsmelding,
    showSelectButton = false,
    showText = true,
}: VisInntektsmeldingButtonProps): ReactElement {
    const { dokumenter, updateDokumenter, updateDokumentState } = useDokumentVisningContext()
    return (
        <Button
            size="xsmall"
            type="button"
            variant="tertiary"
            icon={
                dokumenter.some((d) => d.inntektsmeldingId === inntektsmelding.inntektsmeldingId) ? (
                    <CloseSidePanelIcon aria-hidden fontSize="1.25rem" />
                ) : (
                    <OpenInSidePanelIcon aria-hidden fontSize="1.25rem" />
                )
            }
            iconPosition="right"
            onClick={() => {
                updateDokumentState(inntektsmelding.inntektsmeldingId, { showSelectButton })
                updateDokumenter(inntektsmelding)
            }}
        >
            {showText &&
                (dokumenter.some((d) => d.inntektsmeldingId === inntektsmelding.inntektsmeldingId) ? 'Skjul' : 'Vis')}
        </Button>
    )
}
