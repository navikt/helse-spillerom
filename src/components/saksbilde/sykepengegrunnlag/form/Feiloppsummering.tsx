import { FieldErrors } from 'react-hook-form'
import React, { PropsWithChildren, ReactElement, useEffect, useRef } from 'react'
import { ErrorSummary } from '@navikt/ds-react'
import { ErrorSummaryItem } from '@navikt/ds-react/ErrorSummary'

import { InntektRequest } from '@schemas/inntektRequest'

export function Feiloppsummering({ errors }: { errors: FieldErrors<InntektRequest> }): ReactElement {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
            ref.current.focus()
        }
    }, [errors])

    const shapedErrors = errors.data as {
        type?: { message: string }
        inntektsmeldingId?: { message: string }
        årsinntekt?: { message: string }
        dagbeløp?: { message: string }
        årsak?: { message: string }
        begrunnelse?: { message: string }
        refusjon?: Array<{
            fom?: { message: string }
            tom?: { message: string }
            beløp?: { message: string }
        }>
    }

    return (
        <ErrorSummary ref={ref}>
            {shapedErrors.type?.message && (
                <CustomErrorSummaryItem id="data-type">{shapedErrors.type.message}</CustomErrorSummaryItem>
            )}
            {shapedErrors.inntektsmeldingId?.message && (
                <CustomErrorSummaryItem id="data-inntektsmeldingId">
                    {shapedErrors.inntektsmeldingId.message}
                </CustomErrorSummaryItem>
            )}
            {shapedErrors.årsinntekt?.message && (
                <CustomErrorSummaryItem id="data-årsinntekt">{shapedErrors.årsinntekt.message}</CustomErrorSummaryItem>
            )}
            {shapedErrors.dagbeløp?.message && (
                <CustomErrorSummaryItem id="data-dagbeløp">{shapedErrors.dagbeløp.message}</CustomErrorSummaryItem>
            )}
            {shapedErrors.årsak?.message && (
                <CustomErrorSummaryItem id="data-årsak">{shapedErrors.årsak.message}</CustomErrorSummaryItem>
            )}
            {shapedErrors.refusjon?.map((refusjonError, i) =>
                refusjonError ? (
                    <React.Fragment key={i}>
                        {refusjonError.fom?.message && (
                            <CustomErrorSummaryItem id={`data-refusjon-${i}-fom`}>
                                {refusjonError.fom.message}
                            </CustomErrorSummaryItem>
                        )}
                        {refusjonError.tom?.message && (
                            <CustomErrorSummaryItem id={`data-refusjon-${i}-tom`}>
                                {refusjonError.tom.message}
                            </CustomErrorSummaryItem>
                        )}
                        {refusjonError.beløp?.message && (
                            <CustomErrorSummaryItem id={`data-refusjon-${i}-beløp`}>
                                {refusjonError.beløp.message}
                            </CustomErrorSummaryItem>
                        )}
                    </React.Fragment>
                ) : null,
            )}
            {shapedErrors.begrunnelse?.message && (
                <CustomErrorSummaryItem id="data-begrunnelse">
                    {shapedErrors.begrunnelse.message}
                </CustomErrorSummaryItem>
            )}
        </ErrorSummary>
    )
}

// Siden denne feiloppsummeringen er brukt inne i Tabs-komponenten til Aksel fungerte det dårlig å
// bare bruke ErrorSummary.Item sin href da det endret tabben.
function CustomErrorSummaryItem({ id, children }: PropsWithChildren<{ id: string }>): ReactElement {
    return (
        <ErrorSummaryItem
            className="cursor-pointer"
            as="button"
            onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.focus()
            }}
        >
            {children}
        </ErrorSummaryItem>
    )
}
