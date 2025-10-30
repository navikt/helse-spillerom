'use client'

import React, { ReactElement, useState } from 'react'
import { Button, DatePicker, HStack, VStack, BodyShort, Heading, useDatepicker } from '@navikt/ds-react'
import { PencilIcon, CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons'
import dayjs from 'dayjs'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'

import { useOppdaterYrkesaktivitetPerioder } from '@hooks/mutations/useOppdaterYrkesaktivitet'
import { type Yrkesaktivitet, type Perioder, type Periodetype } from '@schemas/yrkesaktivitet'
import { YrkesaktivitetKategorisering } from '@schemas/yrkesaktivitetKategorisering'
import { getFormattedDateString } from '@utils/date-format'

// Schema for form validering
const periodeFormSchema = z.object({
    perioder: z
        .array(
            z.object({
                fom: z.string().min(1, 'Fra dato er påkrevd'),
                tom: z.string().min(1, 'Til dato er påkrevd'),
            }),
        )
        .refine((perioder) => {
            return perioder.every((periode) => {
                if (!periode.fom || !periode.tom) return true
                const fomDate = dayjs(periode.fom)
                const tomDate = dayjs(periode.tom)
                return fomDate.isValid() && tomDate.isValid() && fomDate.isSameOrBefore(tomDate)
            })
        }, 'Fra dato må være før eller lik til dato'),
})

type PeriodeFormData = z.infer<typeof periodeFormSchema>

interface PeriodeFormProps {
    yrkesaktivitet: Yrkesaktivitet
    kanSaksbehandles: boolean
}

export function PeriodeForm({ yrkesaktivitet, kanSaksbehandles }: PeriodeFormProps): ReactElement {
    const [erIRedigeringsmodus, setErIRedigeringsmodus] = useState(false)

    const mutation = useOppdaterYrkesaktivitetPerioder()

    // Bestem periode-type basert på yrkesaktivitet
    const periodeType: Periodetype = getPeriodeType(yrkesaktivitet.kategorisering)
    const periodeTypeText = getPeriodeTypeText(periodeType)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<PeriodeFormData>({
        resolver: zodResolver(periodeFormSchema),
        defaultValues: {
            perioder: yrkesaktivitet.perioder?.perioder || [],
        },
        mode: 'onChange',
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'perioder',
    })

    const handleStartRedigering = () => {
        setErIRedigeringsmodus(true)
        const eksisterendePerioder = yrkesaktivitet.perioder?.perioder || []

        // Hvis ingen perioder eksisterer, legg til en tom periode
        const initialPerioder = eksisterendePerioder.length > 0 ? eksisterendePerioder : [{ fom: '', tom: '' }]

        reset({
            perioder: initialPerioder,
        })
    }

    const handleAvbryt = () => {
        setErIRedigeringsmodus(false)
        reset({
            perioder: yrkesaktivitet.perioder?.perioder || [],
        })
    }

    const onSubmit = async (data: PeriodeFormData) => {
        try {
            const perioderData: Perioder | null =
                data.perioder.length > 0 ? { type: periodeType, perioder: data.perioder } : null

            await mutation.mutateAsync({
                yrkesaktivitetId: yrkesaktivitet.id,
                perioder: perioderData,
            })

            setErIRedigeringsmodus(false)
        } catch (error) {
            // Feil håndteres av mutation
        }
    }

    const handleLeggTilPeriode = () => {
        append({ fom: '', tom: '' })
    }

    const handleFjernPeriode = (index: number) => {
        remove(index)
    }

    if (!kanSaksbehandles) {
        return (
            <div className="mt-6">
                <PeriodeVisning perioder={yrkesaktivitet.perioder} periodeTypeText={periodeTypeText} />
            </div>
        )
    }

    if (!erIRedigeringsmodus) {
        // Hvis ingen perioder er registrert, vis "Legg til" knapp
        if (!yrkesaktivitet.perioder || yrkesaktivitet.perioder.perioder.length === 0) {
            return (
                <Button size="small" variant="secondary" className="mt-6" onClick={handleStartRedigering}>
                    Legg til {periodeTypeText.toLowerCase()}
                </Button>
            )
        }

        // Hvis perioder er registrert, vis dem med redigeringsknapp
        return (
            <div className="mt-6">
                <PeriodeVisning
                    perioder={yrkesaktivitet.perioder}
                    periodeTypeText={periodeTypeText}
                    onRediger={handleStartRedigering}
                />
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-6 rounded-lg border border-ax-border-accent bg-ax-bg-neutral-soft p-4">
                <VStack gap="4">
                    <HStack justify="space-between" align="center">
                        <Heading size="small">Rediger {periodeTypeText.toLowerCase()}</Heading>
                        <HStack gap="2">
                            <Button
                                size="small"
                                variant="tertiary"
                                icon={<XMarkIcon aria-hidden />}
                                onClick={handleAvbryt}
                                disabled={mutation.isPending}
                                type="button"
                            >
                                Avbryt
                            </Button>
                            <Button
                                size="small"
                                icon={<CheckmarkIcon aria-hidden />}
                                type="submit"
                                disabled={!isValid || mutation.isPending}
                                loading={mutation.isPending}
                            >
                                Lagre
                            </Button>
                        </HStack>
                    </HStack>

                    <VStack gap="3">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="border-ax-border-default bg-white flex items-center gap-3 rounded border p-3"
                            >
                                <div className="flex-1">
                                    <HStack gap="3">
                                        <div className="flex-1">
                                            <Controller
                                                name={`perioder.${index}.fom`}
                                                control={control}
                                                render={({ field: formField }) => (
                                                    <PeriodeDatePicker
                                                        label="Fra dato"
                                                        value={formField.value}
                                                        onChange={formField.onChange}
                                                        error={errors.perioder?.[index]?.fom?.message}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Controller
                                                name={`perioder.${index}.tom`}
                                                control={control}
                                                render={({ field: formField }) => (
                                                    <PeriodeDatePicker
                                                        label="Til dato"
                                                        value={formField.value}
                                                        onChange={formField.onChange}
                                                        error={errors.perioder?.[index]?.tom?.message}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <Button
                                            size="small"
                                            variant="tertiary"
                                            icon={<XMarkIcon aria-hidden />}
                                            onClick={() => handleFjernPeriode(index)}
                                            disabled={mutation.isPending}
                                            type="button"
                                        >
                                            Fjern
                                        </Button>
                                    </HStack>
                                </div>
                            </div>
                        ))}

                        <Button
                            size="small"
                            variant="secondary"
                            onClick={handleLeggTilPeriode}
                            disabled={mutation.isPending}
                            type="button"
                        >
                            + Legg til periode
                        </Button>

                        {errors.perioder && <BodyShort className="text-red-600">{errors.perioder.message}</BodyShort>}
                    </VStack>
                </VStack>
            </div>
        </form>
    )
}

function PeriodeVisning({
    perioder,
    periodeTypeText,
    onRediger,
}: {
    perioder: Perioder | null
    periodeTypeText: string
    onRediger?: () => void
}): ReactElement {
    if (!perioder || perioder.perioder.length === 0) {
        return <></>
    }

    return (
        <div>
            <div className="mb-2 flex items-center">
                <BodyShort>{periodeTypeText}</BodyShort>
                {onRediger && (
                    <Button size="small" variant="tertiary" icon={<PencilIcon aria-hidden />} onClick={onRediger}>
                        Rediger
                    </Button>
                )}
            </div>
            <VStack gap="1">
                {perioder.perioder.map((periode, index) => (
                    <BodyShort key={index}>
                        {getFormattedDateString(periode.fom)} - {getFormattedDateString(periode.tom)}
                    </BodyShort>
                ))}
            </VStack>
        </div>
    )
}

interface PeriodeDatePickerProps {
    label: string
    value: string
    onChange: (value: string) => void
    error?: string
}

function PeriodeDatePicker({ label, value, onChange, error }: PeriodeDatePickerProps): ReactElement {
    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: value ? dayjs(value).toDate() : undefined,
        onDateChange: (date) => {
            onChange(date ? dayjs(date).format('YYYY-MM-DD') : '')
        },
    })

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input {...inputProps} label={label} size="small" error={error} />
        </DatePicker>
    )
}

function getPeriodeType(kategorisering: YrkesaktivitetKategorisering): Periodetype {
    switch (kategorisering.inntektskategori) {
        case 'ARBEIDSTAKER':
            return 'ARBEIDSGIVERPERIODE'
        case 'SELVSTENDIG_NÆRINGSDRIVENDE':
            return 'VENTETID'
        case 'INAKTIV':
            return 'VENTETID_INAKTIV'
        default:
            return 'ARBEIDSGIVERPERIODE' // Fallback
    }
}

function getPeriodeTypeText(periodeType: Periodetype): string {
    switch (periodeType) {
        case 'ARBEIDSGIVERPERIODE':
            return 'Arbeidsgiverperiode'
        case 'VENTETID':
            return 'Ventetid'
        case 'VENTETID_INAKTIV':
            return 'Ventetid inaktiv'
        default:
            return 'Periode'
    }
}
