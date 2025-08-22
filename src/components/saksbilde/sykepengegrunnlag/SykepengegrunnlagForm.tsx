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
    ørerTilKroner,
} from '@schemas/sykepengegrunnlag'
import { Inntektsforhold } from '@schemas/inntektsforhold'
import { useSettSykepengegrunnlag } from '@hooks/mutations/useSettSykepengegrunnlag'
import { gyldigDatoFormat } from '@utils/date-format'
import { cn } from '@utils/tw'

type SykepengegrunnlagFormProps = {
    sykepengegrunnlag?: SykepengegrunnlagResponse
    inntektsforhold: Inntektsforhold[]
    avbryt: () => void
}

export function SykepengegrunnlagForm({
    sykepengegrunnlag,
    inntektsforhold,
    avbryt,
}: SykepengegrunnlagFormProps): ReactElement {
    const [visRefusjonFelter, setVisRefusjonFelter] = useState<Record<string, boolean>>(
        Object.fromEntries(
            (sykepengegrunnlag?.inntekter ?? []).map((inntekt) => [
                inntekt.inntektsforholdId,
                inntekt.refusjon?.some((r) => r.fom || r.tom || r.beløpØre > 0) ?? false,
            ]),
        ),
    )
    const mutation = useSettSykepengegrunnlag()
    const form = useForm<SykepengegrunnlagRequest>({
        resolver: zodResolver(sykepengegrunnlagRequestSchema),
        defaultValues: {
            inntekter: inntektsforhold.map((forhold) => {
                const inntektFraSykepengegrunnlag = sykepengegrunnlag?.inntekter.find(
                    (inntekt) => inntekt.inntektsforholdId === forhold.id,
                )
                return {
                    inntektsforholdId: forhold.id,
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
                {inntektsforhold.map((forhold, index) => (
                    <VStack key={forhold.id} gap="4">
                        <HStack align="end" gap="4">
                            <NavnOgIkon orgnummer={forhold.kategorisering['ORGNUMMER'] as string} className="mb-0.5" />
                            <Controller
                                control={form.control}
                                name={`inntekter.${index}.beløpPerMånedØre`}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        value={ørerTilKroner(field.value)}
                                        onChange={(e) => field.onChange(kronerTilØrer(e.target.value))}
                                        className="ml-auto w-[212px] [&_input]:text-right"
                                        error={fieldState.error?.message}
                                        label="Inntekt"
                                        size="small"
                                    />
                                )}
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
        <VStack gap="2" className="self-end">
            {refusjonFieldArray.fields.map((field, index) => (
                <HStack key={field.id} gap="2" align="center">
                    <Date name={`inntekter.${forholdIndex}.refusjon.${index}.fom`} label="F.o.m. dato" />
                    <Date name={`inntekter.${forholdIndex}.refusjon.${index}.tom`} label="T.o.m. dato" />
                    <Controller
                        control={control}
                        name={`inntekter.${forholdIndex}.refusjon.${index}.beløpØre`}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                value={ørerTilKroner(field.value)}
                                onChange={(e) => field.onChange(kronerTilØrer(e.target.value))}
                                className="max-w-28 [&_input]:text-right"
                                label="Refusjonsbeløp"
                                size="small"
                                error={fieldState.error?.message}
                            />
                        )}
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

function Date({ name, label }: { name: string; label: string }): ReactElement {
    const { control } = useFormContext()
    const { field, fieldState } = useController({ name, control })

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
