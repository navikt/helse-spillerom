import React, { ReactElement } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Radio, RadioGroup } from '@navikt/ds-react'

import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/ny/defaultValues'
import { ArbeidsledigInntektType, arbeidsledigInntektTypeSchema } from '@schemas/inntektRequest'
import { NyPengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'

export function ArbeidsledigInntektFormFields(): ReactElement {
    const { control } = useFormContext<InntektRequestFor<'ARBEIDSLEDIG'>>()

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
            <NyPengerField className="w-[212px]" name="data.månedligBeløp" label="Månedsbeløp" />
        </>
    )
}

const typeLabels: Record<ArbeidsledigInntektType, string> = {
    DAGPENGER: 'Dagpenger',
    VARTPENGER: 'Vartpenger',
    VENTELONN: 'Ventelønn',
}
