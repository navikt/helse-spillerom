import React, { ReactElement } from 'react'
import { Button } from '@navikt/ds-react'
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons'

import { useDokumentVisningContext } from '@/app/person/[personId]/dokumentVisningContext'
import { Inntektsmelding } from '@schemas/inntektsmelding'

interface VisInntektsmeldingButtonProps {
    inntektsmelding: Inntektsmelding
    selectHandler?: () => void
}

export function VisInntektsmeldingButton({
    inntektsmelding,
    selectHandler,
}: VisInntektsmeldingButtonProps): ReactElement {
    const { dokumenter, setDokumenter, setSelectHandlerMap } = useDokumentVisningContext()
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
                if (selectHandler) {
                    setSelectHandlerMap((prev) => ({
                        ...prev,
                        [inntektsmelding.inntektsmeldingId]: { show: true, handler: selectHandler, selected: false },
                    }))
                }
                setDokumenter((prev) => {
                    if (prev.some((d) => d.inntektsmeldingId === inntektsmelding.inntektsmeldingId)) {
                        return prev.filter((d) => d.inntektsmeldingId !== inntektsmelding.inntektsmeldingId)
                    }
                    return [...prev, inntektsmelding]
                })
            }}
        >
            {dokumenter.some((d) => d.inntektsmeldingId === inntektsmelding.inntektsmeldingId) ? 'Skjul' : 'Vis'}
        </Button>
    )
}
