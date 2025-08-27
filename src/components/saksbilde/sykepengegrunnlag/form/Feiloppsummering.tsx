import { FieldErrors } from 'react-hook-form'
import React, { ReactElement } from 'react'
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
                        <ErrorSummary.Item href={`#inntekter-${i}-beløpPerMånedØre`}>
                            {error.beløpPerMånedØre.message}
                        </ErrorSummary.Item>
                    )}
                    {error.kilde?.message && (
                        <ErrorSummary.Item href={`#inntekter-${i}-kilde`}>{error.kilde.message}</ErrorSummary.Item>
                    )}
                    {error.refusjon?.map((refusjonError, j) =>
                        refusjonError ? (
                            <React.Fragment key={j}>
                                {refusjonError.fom?.message && (
                                    <ErrorSummary.Item href={`#inntekter-${i}-refusjon-${j}-fom`}>
                                        {refusjonError.fom.message}
                                    </ErrorSummary.Item>
                                )}
                                {refusjonError.tom?.message && refusjonError.tom?.message !== 'dont-show' && (
                                    <ErrorSummary.Item href={`#inntekter-${i}-refusjon-${j}-tom`}>
                                        {refusjonError.tom.message}
                                    </ErrorSummary.Item>
                                )}
                                {refusjonError.beløpØre?.message && (
                                    <ErrorSummary.Item href={`#inntekter-${i}-refusjon-${j}-beløpØre`}>
                                        {refusjonError.beløpØre.message}
                                    </ErrorSummary.Item>
                                )}
                            </React.Fragment>
                        ) : null,
                    )}
                </React.Fragment>
            ))}
            {errors.begrunnelse && (
                <ErrorSummaryItem href="#begrunnelse">{errors.begrunnelse.message}</ErrorSummaryItem>
            )}
        </ErrorSummary>
    )
}
