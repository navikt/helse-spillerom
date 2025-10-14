import React, { ReactElement } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Radio, RadioGroup } from '@navikt/ds-react'

import {
    Inntektskategori,
    PensjonsgivendeInntektType,
    pensjonsgivendeInntektTypeSchema,
    PensjonsgivendeSkjønnsfastsettelseÅrsak,
    pensjonsgivendeSkjønnsfastsettelseÅrsakSchema,
} from '@schemas/inntektRequest'
import { NyPengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/ny/defaultValues'

export function PensjonsgivendeInntektFormFields({ kategori }: { kategori: Inntektskategori }): ReactElement {
    const { control, watch, setValue } = useFormContext<InntektRequestFor<typeof kategori>>()
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
                                setValue('data.årsak', pensjonsgivendeSkjønnsfastsettelseÅrsakSchema.options[0])
                                setValue('data.årsinntekt', 0)
                            }
                        }}
                    >
                        {pensjonsgivendeInntektTypeSchema.options.map((option) => (
                            <Radio key={option} value={option}>
                                {typeLabels[option]}
                            </Radio>
                        ))}
                    </RadioGroup>
                )}
            />
            {valgtType === 'SKJONNSFASTSETTELSE' && (
                <>
                    <NyPengerField className="w-[212px]" name="data.årsinntekt" label="Pensjonsgivende årsinntekt" />
                    <Controller
                        control={control}
                        name="data.årsak"
                        render={({ field }) => (
                            <RadioGroup {...field} legend="Årsak til skjønnsfastsettelse" size="small">
                                {pensjonsgivendeSkjønnsfastsettelseÅrsakSchema.options.map((option) => (
                                    <Radio key={option} value={option}>
                                        {årsakLabels[option]}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        )}
                    />
                </>
            )}
        </>
    )
}

const typeLabels: Record<PensjonsgivendeInntektType, string> = {
    PENSJONSGIVENDE_INNTEKT: 'Bruk pensjonsgivende inntekt fra skatteetaten',
    SKJONNSFASTSETTELSE: 'Skjønnsfastsatt',
}

const årsakLabels: Record<PensjonsgivendeSkjønnsfastsettelseÅrsak, string> = {
    AVVIK_25_PROSENT_VARIG_ENDRING: '25% avvik og varig endring (§ 8-35 tredje ledd første punktum)',
    SISTE_TRE_YRKESAKTIV: 'Har blitt yrkesaktiv i løpet av de siste tre årene (§ 8-35 tredje ledd andre punktum)',
}
