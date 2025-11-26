import React, { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons'

import { useDokumentVisningContext } from '@/app/person/[personId]/dokumentVisningContext'
import { Inntektsmelding } from '@schemas/inntektsmelding'

interface VisInntektsmeldingButtonProps {
    inntektsmelding: Inntektsmelding
    showSelectButton?: boolean
}

export function VisInntektsmeldingButton({
    inntektsmelding,
    showSelectButton = false,
}: VisInntektsmeldingButtonProps): ReactElement {
    const { dokumenter, updateDokumenter, updateDokumentState } = useDokumentVisningContext()
    return (
        <Button
            size="xsmall"
            type="button"
            variant="tertiary"
            icon={
                dokumenter.some((d) => d.inntektsmeldingId === inntektsmelding.inntektsmeldingId) ? (
                    <ArrowLeftIcon />
                ) : (
                    <ArrowRightIcon />
                )
            }
            iconPosition="right"
            onClick={() => {
                updateDokumentState(inntektsmelding.inntektsmeldingId, { showSelectButton })
                updateDokumenter(inntektsmelding)
            }}
        >
            {dokumenter.some((d) => d.inntektsmeldingId === inntektsmelding.inntektsmeldingId) ? 'Skjul' : 'Vis'}
        </Button>
    )
}
