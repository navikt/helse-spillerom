import React, { ReactElement } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Radio, RadioGroup } from '@navikt/ds-react'

import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { ArbeidsledigInntektType, arbeidsledigInntektTypeSchema } from '@schemas/inntektRequest'
import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'

export function ArbeidsledigInntektFormFields(): ReactElement {
    const { control } = useFormContext<InntektRequestFor<'ARBEIDSLEDIG'>>()
    const valgtType = useWatch({ control, name: 'data.type' })

    return (
        <>
            <Controller
                control={control}
                name="data.type"
                render={({ field }) => (
                    <RadioGroup {...field} legend="Velg type inntekt" size="small">
                        {arbeidsledigInntektTypeSchema.options.map((option) => (
                            <Radio key={option} value={option}>
                                {typeLabels[option]}
                            </Radio>
                        ))}
                    </RadioGroup>
                )}
            />
            {valgtType === 'DAGPENGER' ? (
                <PengerField className="w-[212px]" name="data.dagbeløp" label="Dagbeløp" />
            ) : (
                <PengerField className="w-[212px]" name="data.årsinntekt" label="Årsinntekt" />
            )}
        </>
    )
}

const typeLabels: Record<ArbeidsledigInntektType, string> = {
    DAGPENGER: 'Dagpenger',
    VARTPENGER: 'Vartpenger',
    VENTELONN: 'Ventelønn',
}
