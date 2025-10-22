import React, { Dispatch, Fragment, ReactElement, SetStateAction, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { BodyShort, HGrid, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import dayjs from 'dayjs'

import {
    ArbeidstakerInntektType,
    arbeidstakerInntektTypeSchema,
    ArbeidstakerSkjønnsfastsettelseÅrsak,
    arbeidstakerSkjønnsfastsettelseÅrsakSchema,
} from '@schemas/inntektRequest'
import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { useInntektsmeldinger } from '@hooks/queries/useInntektsmeldinger'
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date-format'
import { RefusjonFields } from '@components/saksbilde/sykepengegrunnlag/form/RefusjonFields'
import { useAktivSaksbehandlingsperiode } from '@hooks/queries/useAktivSaksbehandlingsperiode'
import { Inntektsmelding } from '@schemas/inntektsmelding'
import { formaterBeløpKroner } from '@schemas/sykepengegrunnlag'

export function ArbeidstakerInntektFormFields({ yrkesaktivitetId }: { yrkesaktivitetId: string }): ReactElement {
    const { control, watch, setValue } = useFormContext<InntektRequestFor<'ARBEIDSTAKER'>>()
    const [visRefusjonsFelter, setVisRefusjonsFelter] = useState<boolean>(!!watch('data.refusjon')?.[0]?.fom)
    const aktivSaksbehandlingsperiode = useAktivSaksbehandlingsperiode()
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
                                setValue('data.inntektsmeldingId', '')
                            }
                            if (value === 'SKJONNSFASTSETTELSE' || value === 'MANUELT_BEREGNET') {
                                setValue('data.årsinntekt', 0)
                            }
                        }}
                    >
                        {arbeidstakerInntektTypeSchema.options.map((option) => (
                            <Fragment key={option}>
                                <Radio value={option}>{typeLabels[option]}</Radio>
                                {valgtType === 'INNTEKTSMELDING' && option === 'INNTEKTSMELDING' && (
                                    <VelgInntektsmelding
                                        yrkesaktivitetId={yrkesaktivitetId}
                                        setVisRefusjonsFelter={setVisRefusjonsFelter}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </RadioGroup>
                )}
            />
            {(valgtType === 'SKJONNSFASTSETTELSE' || valgtType === 'MANUELT_BEREGNET') && (
                <PengerField className="w-[212px]" name="data.årsinntekt" label="Årsinntekt" />
            )}
            <RadioGroup
                legend="Refusjon"
                size="small"
                onChange={(value: boolean) => {
                    setVisRefusjonsFelter(value)
                    if (value) {
                        setValue('data.refusjon', [
                            { fom: aktivSaksbehandlingsperiode?.skjæringstidspunkt ?? '', tom: null, beløp: 0 },
                        ])
                    } else {
                        setValue('data.refusjon', undefined)
                    }
                }}
                value={visRefusjonsFelter}
            >
                <Radio value={true}>Ja</Radio>
                <Radio value={false}>Nei</Radio>
            </RadioGroup>
            {visRefusjonsFelter && <RefusjonFields />}
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

interface VelgInntektsmeldingProps {
    yrkesaktivitetId: string
    setVisRefusjonsFelter: Dispatch<SetStateAction<boolean>>
}

function VelgInntektsmelding({ yrkesaktivitetId, setVisRefusjonsFelter }: VelgInntektsmeldingProps): ReactElement {
    const { control, setValue } = useFormContext<InntektRequestFor<'ARBEIDSTAKER'>>()
    const { data: inntektsmeldinger, isLoading, isError } = useInntektsmeldinger(yrkesaktivitetId)

    if (isLoading) {
        return <BodyShort className="m-4 ml-6">Laster...</BodyShort> // TODO lag skeleton her
    }

    if (isError || !inntektsmeldinger) {
        return <BodyShort>tryna</BodyShort> // TODO gjør noe fornuftig
    }

    return (
        <Controller
            control={control}
            name="data.inntektsmeldingId"
            render={({ field }) => (
                <RadioGroup {...field} legend="Velg inntektsmelding" hideLegend size="small">
                    <VStack gap="2" className="m-4 ml-6">
                        {inntektsmeldinger.map((inntektsmelding) => (
                            <Radio
                                key={inntektsmelding.inntektsmeldingId}
                                value={inntektsmelding.inntektsmeldingId}
                                onChange={(value) => {
                                    field.onChange(value)
                                    setValue('data.refusjon', refusjonFra(inntektsmelding))
                                    setVisRefusjonsFelter(true)
                                }}
                                className="w-[400px] items-center rounded-lg border border-ax-bg-neutral-strong bg-ax-bg-neutral-soft p-4"
                            >
                                <HGrid columns={2} gap="1 6">
                                    <BodyShort weight="semibold" size="small">
                                        Orgnummer:
                                    </BodyShort>
                                    <BodyShort size="small">{inntektsmelding.virksomhetsnummer}</BodyShort>

                                    <BodyShort weight="semibold" size="small">
                                        Mottatt:
                                    </BodyShort>
                                    <BodyShort size="small">
                                        {getFormattedDatetimeString(inntektsmelding.mottattDato)}
                                    </BodyShort>

                                    <BodyShort weight="semibold" size="small">
                                        Beregnet inntekt:
                                    </BodyShort>
                                    <BodyShort size="small">
                                        {formaterBeløpKroner(Number(inntektsmelding.beregnetInntekt))}
                                    </BodyShort>

                                    <BodyShort weight="semibold" size="small">
                                        Første fraværsdag:
                                    </BodyShort>
                                    <BodyShort size="small">
                                        {getFormattedDateString(inntektsmelding.foersteFravaersdag ?? null)}
                                    </BodyShort>

                                    {inntektsmelding.arbeidsgiverperioder.map((arbeidsgiverperiode, i) => (
                                        <Fragment key={i + arbeidsgiverperiode.fom}>
                                            <BodyShort weight="semibold" size="small">
                                                Arbeidsgiverperiode:
                                            </BodyShort>
                                            <BodyShort size="small">
                                                {getFormattedDateString(arbeidsgiverperiode.fom) +
                                                    ' - ' +
                                                    getFormattedDateString(arbeidsgiverperiode.tom)}
                                            </BodyShort>
                                        </Fragment>
                                    ))}
                                </HGrid>
                            </Radio>
                        ))}
                    </VStack>
                </RadioGroup>
            )}
        />
    )
}

function refusjonFra(inntektsmelding: Inntektsmelding) {
    const { refusjon, endringIRefusjoner: endringer = [], foersteFravaersdag } = inntektsmelding
    const sortedEndringer = [...endringer].sort((a, b) => dayjs(a.endringsdato).diff(dayjs(b.endringsdato)))

    const periods = []
    let currentFom: string = foersteFravaersdag ?? ''
    let currentBeløp: number = Number(refusjon?.beloepPrMnd) ?? 0

    for (let i = 0; i < sortedEndringer.length; i++) {
        const next = sortedEndringer[i]
        periods.push({
            fom: currentFom,
            tom: dayjs(next.endringsdato).subtract(1, 'day').format('YYYY-MM-DD'),
            beløp: currentBeløp,
        })
        currentFom = next.endringsdato ?? ''
        currentBeløp = Number(next.beloep) ?? 0
    }

    // Last period
    periods.push({
        fom: currentFom,
        tom: refusjon?.opphoersdato ?? null,
        beløp: currentBeløp,
    })

    return periods
}
