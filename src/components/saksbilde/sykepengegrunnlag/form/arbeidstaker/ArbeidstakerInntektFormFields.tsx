import React, { Fragment, ReactElement, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { BodyShort, Button, HGrid, HStack, Radio, RadioGroup, Select, VStack } from '@navikt/ds-react'
import dayjs from 'dayjs'
import { ArrowLeftIcon, ArrowRightIcon } from '@navikt/aksel-icons'

import {
    ArbeidstakerInntektType,
    arbeidstakerInntektTypeSchema,
    ArbeidstakerSkjønnsfastsettelseÅrsak,
    arbeidstakerSkjønnsfastsettelseÅrsakSchema,
    RefusjonInfo,
} from '@schemas/inntektRequest'
import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { useInntektsmeldinger } from '@hooks/queries/useInntektsmeldinger'
import { getFormattedDateString, getFormattedDatetimeString } from '@utils/date-format'
import { RefusjonFields } from '@components/saksbilde/sykepengegrunnlag/form/RefusjonFields'
import { useAktivSaksbehandlingsperiode } from '@hooks/queries/useAktivSaksbehandlingsperiode'
import { Inntektsmelding } from '@schemas/inntektsmelding'
import { formaterBeløpKroner } from '@schemas/øreUtils'
import { VisAinntekt } from '@components/saksbilde/sykepengegrunnlag/form/VisAinntekt'
import { useDokumentVisningContext } from '@/app/person/[personId]/dokumentVisningContext'

export function ArbeidstakerInntektFormFields({ yrkesaktivitetId }: { yrkesaktivitetId: string }): ReactElement {
    const { control, watch, setValue } = useFormContext<InntektRequestFor<'ARBEIDSTAKER'>>()
    const visRefusjonsFelter = !!watch('data.refusjon')?.[0]?.fom
    const aktivSaksbehandlingsperiode = useAktivSaksbehandlingsperiode()
    const valgtType = watch('data.type')

    return (
        <>
            <HStack gap="4">
                <PengerField
                    className="w-[120px]"
                    name="data.årsinntekt"
                    label="Årsinntekt"
                    readOnly={['INNTEKTSMELDING', 'AINNTEKT', 'DEFAULT'].includes(valgtType)}
                />
                <Controller
                    control={control}
                    name="data.type"
                    render={({ field, fieldState }) => (
                        <Select
                            {...field}
                            label="Kilde"
                            size="small"
                            id="data-type"
                            value={field.value}
                            onChange={(value) => {
                                const valg = value.target.value
                                field.onChange(valg)

                                if (valg === 'SKJONNSFASTSETTELSE') {
                                    setValue('data.årsak', arbeidstakerSkjønnsfastsettelseÅrsakSchema.options[0])
                                }
                                if (valg === 'INNTEKTSMELDING') {
                                    setValue('data.inntektsmeldingId', '')
                                    setValue('data.årsinntekt', 0)
                                }
                                if (valg === 'SKJONNSFASTSETTELSE' || valg === 'MANUELT_BEREGNET') {
                                    setValue('data.årsinntekt', 0)
                                }
                            }}
                            error={fieldState.error?.message != undefined}
                        >
                            {arbeidstakerInntektTypeSchema.options.map((option) => (
                                <option key={option} value={option}>
                                    {typeLabels[option]}
                                </option>
                            ))}
                        </Select>
                    )}
                />
            </HStack>

            {valgtType === 'INNTEKTSMELDING' && <VelgInntektsmelding yrkesaktivitetId={yrkesaktivitetId} />}

            {valgtType === 'AINNTEKT' && (
                <VisAinntekt yrkesaktivitetId={yrkesaktivitetId} setValue={(field, val) => setValue(field, val)} />
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

            {valgtType !== 'DEFAULT' && (
                <RadioGroup
                    legend="Refusjon"
                    size="small"
                    onChange={(value: boolean) => {
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
            )}

            {visRefusjonsFelter && <RefusjonFields />}
        </>
    )
}

const typeLabels: Record<ArbeidstakerInntektType, string> = {
    DEFAULT: 'Velg kilde',
    INNTEKTSMELDING: 'Inntektsmelding',
    AINNTEKT: 'A-inntekt',
    SKJONNSFASTSETTELSE: 'Skjønnsfastsatt',
    MANUELT_BEREGNET: 'Manuelt beregnet',
}

export const arbeidstakerSkjønnsfastsettelseÅrsakLabels: Record<ArbeidstakerSkjønnsfastsettelseÅrsak, string> = {
    AVVIK_25_PROSENT: 'Skjønnsfastsettelse ved mer enn 25 % avvik (§ 8-30 andre ledd)',
    MANGELFULL_RAPPORTERING: 'Skjønnsfastsettelse ved mangelfull eller uriktig rapportering (§ 8-30 tredje ledd)',
    TIDSAVGRENSET: 'Skjønnsfastsettelse ved tidsbegrenset arbeidsforhold under 6 måneder (§ 8-30 fjerde ledd)',
}

function VelgInntektsmelding({ yrkesaktivitetId }: { yrkesaktivitetId: string }): ReactElement {
    const { control, setValue, watch } = useFormContext<InntektRequestFor<'ARBEIDSTAKER'>>()
    const { data: inntektsmeldinger, isLoading, isError } = useInntektsmeldinger(yrkesaktivitetId)
    const valgtInntektsmeldingId = watch('data.inntektsmeldingId')

    useEffect(() => {
        const valgtInntektsmelding = inntektsmeldinger?.find((m) => m.inntektsmeldingId === valgtInntektsmeldingId)
        if (valgtInntektsmelding) {
            setValue('data.årsinntekt', Number(valgtInntektsmelding.beregnetInntekt) * 12)
        }
    }, [valgtInntektsmeldingId, inntektsmeldinger, setValue])

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
            render={({ field, fieldState }) => (
                <RadioGroup
                    {...field}
                    legend="Velg inntektsmeldingen som er lagt til grunn"
                    hideLegend
                    size="small"
                    error={fieldState.error?.message != undefined}
                >
                    <VStack gap="2">
                        {inntektsmeldinger
                            .sort((a, b) => dayjs(b.mottattDato).diff(dayjs(a.mottattDato)))
                            .map((inntektsmelding, i) => {
                                function handleSelect(id: string) {
                                    field.onChange(id)
                                    setValue('data.årsinntekt', Number(inntektsmelding.beregnetInntekt) * 12)

                                    const refusjon = refusjonFra(inntektsmelding)
                                    const harRefusjon = refusjon.length > 1 || refusjon[0].beløp !== 0

                                    setValue('data.refusjon', harRefusjon ? refusjon : undefined)
                                }

                                return (
                                    <HStack gap="2" key={inntektsmelding.inntektsmeldingId}>
                                        <Radio
                                            key={inntektsmelding.inntektsmeldingId}
                                            id={i === 0 ? 'data-inntektsmeldingId' : undefined}
                                            value={inntektsmelding.inntektsmeldingId}
                                            onChange={() => handleSelect(inntektsmelding.inntektsmeldingId)}
                                        >
                                            Mottatt: {getFormattedDatetimeString(inntektsmelding.mottattDato)}
                                        </Radio>
                                        <VisInntektsmeldingButton
                                            inntektsmelding={inntektsmelding}
                                            handleSelect={() => handleSelect(inntektsmelding.inntektsmeldingId)}
                                        />
                                    </HStack>
                                )
                            })}
                    </VStack>
                </RadioGroup>
            )}
        />
    )
}

export function InntektsmeldingVisning({ inntektsmelding }: { inntektsmelding: Inntektsmelding }): ReactElement {
    return (
        <HGrid columns={2} className="w-[380px]">
            <BodyShort size="small" textColor="subtle">
                Mottatt:
            </BodyShort>
            <BodyShort size="small">{getFormattedDatetimeString(inntektsmelding.mottattDato)}</BodyShort>

            <BodyShort size="small" textColor="subtle">
                Beregnet inntekt:
            </BodyShort>
            <BodyShort size="small">{formaterBeløpKroner(Number(inntektsmelding.beregnetInntekt))}</BodyShort>

            <BodyShort size="small" textColor="subtle">
                Første fraværsdag:
            </BodyShort>
            <BodyShort size="small">
                {inntektsmelding.foersteFravaersdag ? getFormattedDateString(inntektsmelding.foersteFravaersdag) : '-'}
            </BodyShort>

            {inntektsmelding.arbeidsgiverperioder.map((arbeidsgiverperiode, i) => (
                <Fragment key={i + arbeidsgiverperiode.fom}>
                    <BodyShort size="small" textColor="subtle">
                        Arbeidsgiverperiode:
                    </BodyShort>
                    <BodyShort size="small">
                        {getFormattedDateString(arbeidsgiverperiode.fom) +
                            ' - ' +
                            getFormattedDateString(arbeidsgiverperiode.tom)}
                    </BodyShort>
                </Fragment>
            ))}

            <BodyShort size="small" textColor="subtle">
                Organisasjonsnummer:
            </BodyShort>
            <BodyShort size="small">{inntektsmelding.virksomhetsnummer}</BodyShort>
        </HGrid>
    )
}

export function refusjonFra(inntektsmelding: Inntektsmelding): RefusjonInfo[] {
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

function VisInntektsmeldingButton({
    inntektsmelding,
    handleSelect,
}: {
    inntektsmelding: Inntektsmelding
    handleSelect: () => void
}): ReactElement {
    const { dokumenter, setDokumenter, setHandleSelectMap } = useDokumentVisningContext()
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
                setHandleSelectMap((prev) => ({
                    ...prev,
                    [inntektsmelding.inntektsmeldingId]: handleSelect,
                }))
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
