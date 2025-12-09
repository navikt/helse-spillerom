import React, { ReactElement, useEffect, useRef } from 'react'
import { Controller, useFormContext, UseFormGetValues, UseFormSetValue, useWatch } from 'react-hook-form'
import { BodyShort, HStack, Radio, RadioGroup, Select, VStack } from '@navikt/ds-react'
import dayjs from 'dayjs'

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
import { getFormattedDatetimeString } from '@utils/date-format'
import { RefusjonFields } from '@components/saksbilde/sykepengegrunnlag/form/RefusjonFields'
import { useAktivSaksbehandlingsperiode } from '@hooks/queries/useAktivSaksbehandlingsperiode'
import { Inntektsmelding } from '@schemas/inntektsmelding'
import { VisAinntekt } from '@components/saksbilde/sykepengegrunnlag/form/VisAinntekt'
import { useDokumentVisningContext } from '@/app/person/[personId]/dokumentVisningContext'
import { OpenDocumentInSidebarButton } from '@components/sidemenyer/høyremeny/dokumenter/OpenDocumentInSidebarButton'

export function ArbeidstakerInntektFormFields({ yrkesaktivitetId }: { yrkesaktivitetId: string }): ReactElement {
    const { control, setValue } = useFormContext<InntektRequestFor<'ARBEIDSTAKER'>>()
    const { hideSelectButtonForAll } = useDokumentVisningContext()
    const refusjon = useWatch({ control, name: 'data.refusjon' })
    const valgtType = useWatch({ control, name: 'data.type' })
    const visRefusjonsFelter = !!refusjon?.[0]?.fom
    const aktivSaksbehandlingsperiode = useAktivSaksbehandlingsperiode()

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
                                const valg = value.currentTarget.value
                                field.onChange(valg)

                                if (valg !== 'INNTEKTSMELDING') {
                                    hideSelectButtonForAll()
                                }

                                if (valg === 'SKJONNSFASTSETTELSE') {
                                    setValue('data.årsak', arbeidstakerSkjønnsfastsettelseÅrsakSchema.options[0])
                                }
                                if (valg === 'INNTEKTSMELDING') {
                                    setValue('data.inntektsmeldingId', '')
                                    setValue('data.årsinntekt', 0)
                                }
                                if (valg === 'SKJONNSFASTSETTELSE') {
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
}

export const arbeidstakerSkjønnsfastsettelseÅrsakLabels: Record<ArbeidstakerSkjønnsfastsettelseÅrsak, string> = {
    AVVIK_25_PROSENT: 'Skjønnsfastsettelse ved mer enn 25 % avvik (§ 8-30 andre ledd)',
    MANGELFULL_RAPPORTERING: 'Skjønnsfastsettelse ved mangelfull eller uriktig rapportering (§ 8-30 tredje ledd)',
    TIDSAVGRENSET: 'Skjønnsfastsettelse ved tidsbegrenset arbeidsforhold under 6 måneder (§ 8-30 fjerde ledd)',
}

function VelgInntektsmelding({ yrkesaktivitetId }: { yrkesaktivitetId: string }): ReactElement {
    const { control, setValue, getValues } = useFormContext<InntektRequestFor<'ARBEIDSTAKER'>>()
    const { data: inntektsmeldinger, isLoading, isError } = useInntektsmeldinger(yrkesaktivitetId)
    const { selectDokument } = useDokumentVisningContext()
    const valgtInntektsmeldingId = useWatch({ control, name: 'data.inntektsmeldingId' })

    useSyncInntektsmelding(valgtInntektsmeldingId, setValue, getValues, inntektsmeldinger)

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
                            .map((inntektsmelding, i) => (
                                <HStack gap="2" key={inntektsmelding.inntektsmeldingId}>
                                    <Radio
                                        key={inntektsmelding.inntektsmeldingId}
                                        id={i === 0 ? 'data-inntektsmeldingId' : undefined}
                                        value={inntektsmelding.inntektsmeldingId}
                                        onChange={(e) => {
                                            field.onChange(e.target.value)

                                            const refusjon = refusjonFra(inntektsmelding)
                                            const harRefusjon = refusjon.length > 1 || refusjon[0].beløp !== 0

                                            setValue('data.årsinntekt', Number(inntektsmelding.beregnetInntekt) * 12)
                                            setValue('data.refusjon', harRefusjon ? refusjon : undefined)
                                            selectDokument(e.target.value)
                                        }}
                                    >
                                        Mottatt: {getFormattedDatetimeString(inntektsmelding.mottattDato)}
                                    </Radio>
                                    <OpenDocumentInSidebarButton dokument={inntektsmelding} showSelectButton />
                                </HStack>
                            ))}
                    </VStack>
                </RadioGroup>
            )}
        />
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

    periods.push({
        fom: currentFom,
        tom: refusjon?.opphoersdato ?? null,
        beløp: currentBeløp,
    })

    return periods
}

function useSyncInntektsmelding(
    valgtId: string,
    setValue: UseFormSetValue<InntektRequestFor<'ARBEIDSTAKER'>>,
    getValues: UseFormGetValues<InntektRequestFor<'ARBEIDSTAKER'>>,
    inntektsmeldinger?: Inntektsmelding[],
) {
    const { dokumentStateMap, syncDokumentStateWithForm } = useDokumentVisningContext()
    const didRun = useRef(false)

    // Setter årsinntekt avhengig av persistert valg av inntektsmelding og oppdaterer dokument-state.
    // Skal bare kjøre én gang - etter inntektsmeldinger er fetchet
    useEffect(() => {
        if (!inntektsmeldinger || didRun.current) return

        didRun.current = true

        syncDokumentStateWithForm(
            inntektsmeldinger.map((m) => m.inntektsmeldingId),
            valgtId,
        )

        const valgt = inntektsmeldinger.find((im) => im.inntektsmeldingId === valgtId)
        if (valgt) {
            setValue('data.årsinntekt', Number(valgt.beregnetInntekt) * 12)
        }
    }, [inntektsmeldinger, valgtId, syncDokumentStateWithForm, setValue])

    // Oppdaterer state i form når inntektsmelding velges fra dokumentvisningen
    useEffect(() => {
        const selectedId = Object.keys(dokumentStateMap).find((key) => dokumentStateMap[key].isSelected)

        if (!inntektsmeldinger || !selectedId || getValues('data.inntektsmeldingId') === selectedId) {
            return
        }

        const valgt = inntektsmeldinger.find((im) => im.inntektsmeldingId === selectedId)

        if (!valgt) return

        const refusjon = refusjonFra(valgt)
        const harRefusjon = refusjon.length > 1 || refusjon[0].beløp !== 0

        setValue('data.inntektsmeldingId', valgt.inntektsmeldingId)
        setValue('data.årsinntekt', Number(valgt.beregnetInntekt) * 12)
        setValue('data.refusjon', harRefusjon ? refusjon : undefined)
    }, [dokumentStateMap, inntektsmeldinger, setValue, getValues])
}
