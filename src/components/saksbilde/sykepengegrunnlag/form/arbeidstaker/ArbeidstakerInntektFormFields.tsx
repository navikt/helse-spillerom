import React, { ReactElement } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Radio, RadioGroup } from '@navikt/ds-react'

import {
    ArbeidstakerInntektType,
    arbeidstakerInntektTypeSchema,
    ArbeidstakerSkjønnsfastsettelseÅrsak,
    arbeidstakerSkjønnsfastsettelseÅrsakSchema,
} from '@schemas/inntektRequest'
import { NyPengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'

export function ArbeidstakerInntektFormFields(): ReactElement {
    const { control, watch, setValue } = useFormContext<InntektRequestFor<'ARBEIDSTAKER'>>()
    const valgtType = watch('data.type')

    return (
        <>
            <Controller
                control={control}
                name="data.type"
                render={({ field }) => (
                    <RadioGroup
                        {...field}
                        legend="Velg kilde for inntektsdata"
                        size="small"
                        onChange={(value) => {
                            field.onChange(value)
                            if (value === 'SKJONNSFASTSETTELSE') {
                                setValue('data.årsak', arbeidstakerSkjønnsfastsettelseÅrsakSchema.options[0])
                            }
                            if (value === 'INNTEKTSMELDING') {
                                // må få opp valg om å velge inntektsmelding nå denne velges
                                setValue('data.inntektsmeldingId', '')
                            }
                        }}
                    >
                        {arbeidstakerInntektTypeSchema.options.map((option) => (
                            <Radio key={option} value={option}>
                                {typeLabels[option]}
                            </Radio>
                        ))}
                    </RadioGroup>
                )}
            />
            {(valgtType === 'SKJONNSFASTSETTELSE' || valgtType === 'MANUELT_BEREGNET') && (
                <NyPengerField className="w-[212px]" name="data.månedsbeløp" label="Månedsbeløp" />
            )}
            {valgtType === 'SKJONNSFASTSETTELSE' && (
                <Controller
                    control={control}
                    name="data.årsak"
                    render={({ field }) => (
                        <RadioGroup {...field} legend="Årsak til skjønnsfastsettelse" size="small">
                            {arbeidstakerSkjønnsfastsettelseÅrsakSchema.options.map((option) => (
                                <Radio key={option} value={option}>
                                    {arbeidstakerSkjønnsfastsettelseÅrsakLabels[option]}
                                </Radio>
                            ))}
                        </RadioGroup>
                    )}
                />
            )}
        </>
    )
}

const typeLabels: Record<ArbeidstakerInntektType, string> = {
    INNTEKTSMELDING: 'Inntektsmelding',
    AINNTEKT: 'Hent fra A-inntekt',
    SKJONNSFASTSETTELSE: 'Skjønnsfastsatt',
    MANUELT_BEREGNET: 'Manuelt beregnet',
}

export const arbeidstakerSkjønnsfastsettelseÅrsakLabels: Record<ArbeidstakerSkjønnsfastsettelseÅrsak, string> = {
    AVVIK_25_PROSENT: 'Skjønnsfastsettelse ved mer enn 25 % avvik (§ 8-30 andre ledd)',
    MANGELFULL_RAPPORTERING: 'Skjønnsfastsettelse ved mangelfull eller uriktig rapportering (§ 8-30 tredje ledd)',
    TIDSAVGRENSET: 'Skjønnsfastsettelse ved tidsbegrenset arbeidsforhold under 6 måneder (§ 8-30 fjerde ledd)',
}
