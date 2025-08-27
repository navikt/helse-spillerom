import React, { ReactElement, useState } from 'react'
import { Controller, FormProvider, useController, useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    BodyShort,
    Button,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    HStack,
    Select,
    Textarea,
    TextField,
    useDatepicker,
    VStack,
} from '@navikt/ds-react'

import { NavnOgIkon } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import {
    formaterBeløpØre,
    kronerTilØrer,
    SykepengegrunnlagRequest,
    sykepengegrunnlagRequestSchema,
    SykepengegrunnlagResponse,
    øreTilDisplay,
} from '@schemas/sykepengegrunnlag'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { useSettSykepengegrunnlag } from '@hooks/mutations/useSettSykepengegrunnlag'
import { gyldigDatoFormat } from '@utils/date-format'
import { cn } from '@utils/tw'

type SykepengegrunnlagFormProps = {
    sykepengegrunnlag?: SykepengegrunnlagResponse
    yrkesaktivitet: Yrkesaktivitet[]
    avbryt: () => void
}

export function SykepengegrunnlagForm({
    sykepengegrunnlag,
    yrkesaktivitet,
    avbryt,
}: SykepengegrunnlagFormProps): ReactElement {
    const [visRefusjonFelter, setVisRefusjonFelter] = useState<Record<string, boolean>>(
        Object.fromEntries(
            (sykepengegrunnlag?.inntekter ?? []).map((inntekt) => [
                inntekt.yrkesaktivitetId,
                inntekt.refusjon?.some((r) => r.fom || r.tom || r.beløpØre > 0) ?? false,
            ]),
        ),
    )
    const mutation = useSettSykepengegrunnlag()
    const form = useForm<SykepengegrunnlagRequest>({
        resolver: zodResolver(sykepengegrunnlagRequestSchema),
        defaultValues: {
            inntekter: yrkesaktivitet.map((forhold) => {
                const inntektFraSykepengegrunnlag = sykepengegrunnlag?.inntekter.find(
                    (inntekt) => inntekt.yrkesaktivitetId === forhold.id,
                )
                return {
                    yrkesaktivitetId: forhold.id,
                    beløpPerMånedØre: inntektFraSykepengegrunnlag?.beløpPerMånedØre ?? 0,
                    kilde: inntektFraSykepengegrunnlag?.kilde ?? 'INNTEKTSMELDING',
                    refusjon: inntektFraSykepengegrunnlag?.refusjon ?? [],
                }
            }),
            begrunnelse: sykepengegrunnlag?.begrunnelse ?? '',
        },
    })

    async function onSubmit(values: SykepengegrunnlagRequest) {
        await mutation.mutateAsync(values).then(() => {
            form.reset()
            avbryt()
        })
    }

    return (
        <FormProvider {...form}>
            <form role="form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-nowrap gap-6 pb-6">
                {yrkesaktivitet.map((forhold, index) => (
                    <VStack key={forhold.id} gap="4">
                        <HStack align="end" gap="4" wrap={false}>
                            <NavnOgIkon orgnummer={forhold.kategorisering['ORGNUMMER'] as string} className="mb-0.5" />
                            <PengerField
                                className="ml-auto w-[212px]"
                                name={`inntekter.${index}.beløpPerMånedØre`}
                                label="Inntekt"
                            />
                            <Controller
                                control={form.control}
                                name={`inntekter.${index}.kilde`}
                                render={({ field, fieldState }) => (
                                    <Select
                                        size="small"
                                        label="Kilde"
                                        value={field.value}
                                        error={fieldState.error?.message}
                                        onChange={(val) => field.onChange(val.target.value)}
                                    >
                                        <option value="INNTEKTSMELDING">Inntektsmelding</option>
                                        <option value="SAKSBEHANDLER">Saksbehandler</option>
                                        <option value="AINNTEKT">A-inntekt</option>
                                        <option value="PENSJONSGIVENDE_INNTEKT">Sigrun</option>
                                        <option value="SKJONNSFASTSETTELSE">Skjønnsfastsatt</option>
                                    </Select>
                                )}
                            />
                            <CheckboxGroup
                                className={cn({
                                    invisible: forhold.kategorisering['INNTEKTSKATEGORI'] !== 'ARBEIDSTAKER',
                                })}
                                size="small"
                                legend="Refusjon"
                                value={visRefusjonFelter[forhold.id] ? ['ja'] : []}
                                onChange={(values: string[]) => {
                                    const checked = values.includes('ja')
                                    setVisRefusjonFelter((prev) => ({ ...prev, [forhold.id]: checked }))
                                    if (checked) {
                                        form.setValue(`inntekter.${index}.refusjon`, [
                                            { fom: '', tom: '', beløpØre: 0 },
                                        ])
                                    } else {
                                        form.setValue(`inntekter.${index}.refusjon`, [])
                                    }
                                }}
                            >
                                <Checkbox value="ja" hideLabel>
                                    Ja
                                </Checkbox>
                            </CheckboxGroup>
                        </HStack>
                        {visRefusjonFelter[forhold.id] && <RefusjonFields forholdIndex={index} />}
                    </VStack>
                ))}
                <span className="border-t border-t-ax-bg-neutral-strong" />
                <HStack justify="space-between" className="max-w-[474px]">
                    <BodyShort weight="semibold">Totalt</BodyShort>
                    <BodyShort>{formaterBeløpØre(sykepengegrunnlag?.totalInntektØre)}</BodyShort>
                </HStack>
                <Controller
                    control={form.control}
                    name="begrunnelse"
                    render={({ field, fieldState }) => (
                        <Textarea
                            {...field}
                            value={field.value ?? ''}
                            className="mt-2 w-[640px]"
                            size="small"
                            label="Begrunnelse"
                            description={
                                <span>Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.</span>
                            }
                            maxLength={1000}
                            minRows={6}
                            error={fieldState.error?.message}
                        />
                    )}
                />
                <HStack gap="2" className="mt-4">
                    <Button size="small" type="submit" loading={form.formState.isSubmitting}>
                        Lagre
                    </Button>
                    <Button
                        size="small"
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            form.reset()
                            avbryt()
                        }}
                        disabled={form.formState.isSubmitting}
                    >
                        Avbryt
                    </Button>
                </HStack>
            </form>
        </FormProvider>
    )
}

function RefusjonFields({ forholdIndex }: { forholdIndex: number }): ReactElement {
    const { control } = useFormContext()
    const refusjonFieldArray = useFieldArray({
        control,
        name: `inntekter.${forholdIndex}.refusjon`,
    })

    return (
        <VStack gap="4" className="self-end">
            {refusjonFieldArray.fields.map((field, index) => (
                <HStack key={field.id} gap="2" align="center" wrap={false}>
                    <DateField name={`inntekter.${forholdIndex}.refusjon.${index}.fom`} label="F.o.m. dato" />
                    <DateField name={`inntekter.${forholdIndex}.refusjon.${index}.tom`} label="T.o.m. dato" />
                    <PengerField
                        className="max-w-28"
                        name={`inntekter.${forholdIndex}.refusjon.${index}.beløpØre`}
                        label="Refusjonsbeløp"
                    />
                    <Button
                        className={cn('mt-7 mr-5', { invisible: index === 0 })}
                        size="xsmall"
                        variant="tertiary"
                        type="button"
                        onClick={() => refusjonFieldArray.remove(index)}
                    >
                        Slett
                    </Button>
                </HStack>
            ))}
            <Button
                size="xsmall"
                variant="tertiary"
                type="button"
                onClick={() => refusjonFieldArray.append({ fom: '', tom: '', beløpØre: 0 })}
                className="self-start"
            >
                + Legg til
            </Button>
        </VStack>
    )
}

function DateField({ name, label }: { name: string; label: string }): ReactElement {
    const { field, fieldState } = useController({ name })

    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: field.value,
        onDateChange: (date) => {
            if (!date) {
                field.onChange('')
            } else {
                field.onChange(gyldigDatoFormat(date))
            }
        },
    })

    return (
        <DatePicker {...datepickerProps}>
            <DatePicker.Input
                {...inputProps}
                size="small"
                label={label}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
            />
        </DatePicker>
    )
}

function PengerField({ name, label, className }: { name: string; label: string; className: string }): ReactElement {
    const { field, fieldState } = useController({ name })
    const [display, setDisplay] = useState(() => øreTilDisplay(field.value))
    const commit = () => field.onChange(kronerTilØrer(display))

    return (
        <TextField
            value={display}
            onChange={(e) => setDisplay(e.target.value)}
            onBlur={() => {
                commit()
                field.onBlur()
            }}
            onKeyDown={(e) => e.key === 'Enter' && commit()}
            className={cn('[&_input]:text-right', className)}
            error={fieldState.error?.message}
            label={label}
            size="small"
        />
    )
}
