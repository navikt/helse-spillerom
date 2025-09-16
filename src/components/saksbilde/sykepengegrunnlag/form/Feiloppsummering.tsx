import { FieldErrors } from 'react-hook-form'
import React, { PropsWithChildren, ReactElement } from 'react'
import { ErrorSummary } from '@navikt/ds-react'
import { ErrorSummaryItem } from '@navikt/ds-react/ErrorSummary'

import { SykepengegrunnlagRequest } from '@schemas/sykepengegrunnlag'

export function Feiloppsummering({ errors }: { errors: FieldErrors<SykepengegrunnlagRequest> }): ReactElement {
    const inntekterErrors = errors.inntekter as Array<{
        beløpPerMånedØre?: { message: string }
        kilde?: { message: string }
        refusjon?: Array<{
            message?: string
            fom?: { message: string }
            tom?: { message: string }
            beløpØre?: { message: string }
        }>
    }>

    return (
        <ErrorSummary>
            {inntekterErrors?.map((error, i) => (
                <React.Fragment key={i}>
                    {error.beløpPerMånedØre?.message && (
                        <CustomErrorSummaryItem id={`inntekter-${i}-beløpPerMånedØre`}>
                            {error.beløpPerMånedØre.message}
                        </CustomErrorSummaryItem>
                    )}
                    {error.kilde?.message && (
                        <CustomErrorSummaryItem id={`inntekter-${i}-kilde`}>
                            {error.kilde.message}
                        </CustomErrorSummaryItem>
                    )}
                    {error.refusjon?.map((refusjonError, j) =>
                        refusjonError ? (
                            <React.Fragment key={j}>
                                {refusjonError.fom?.message && (
                                    <CustomErrorSummaryItem id={`inntekter-${i}-refusjon-${j}-fom`}>
                                        {refusjonError.fom.message}
                                    </CustomErrorSummaryItem>
                                )}
                                {refusjonError.tom?.message && (
                                    <CustomErrorSummaryItem id={`inntekter-${i}-refusjon-${j}-tom`}>
                                        {refusjonError.tom.message}
                                    </CustomErrorSummaryItem>
                                )}
                                {refusjonError.beløpØre?.message && (
                                    <CustomErrorSummaryItem id={`inntekter-${i}-refusjon-${j}-beløpØre`}>
                                        {refusjonError.beløpØre.message}
                                    </CustomErrorSummaryItem>
                                )}
                            </React.Fragment>
                        ) : null,
                    )}
                </React.Fragment>
            ))}
            {errors.begrunnelse && (
                <CustomErrorSummaryItem id="begrunnelse">{errors.begrunnelse.message}</CustomErrorSummaryItem>
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
