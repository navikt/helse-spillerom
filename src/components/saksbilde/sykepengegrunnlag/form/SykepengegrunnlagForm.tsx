import React, { ReactElement, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BodyShort, Button, Checkbox, CheckboxGroup, HStack, Select, Textarea, VStack } from '@navikt/ds-react'

import { NavnOgIkon } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import {
    formaterBeløpØre,
    SykepengegrunnlagRequest,
    sykepengegrunnlagRequestSchema,
    SykepengegrunnlagResponse,
} from '@schemas/sykepengegrunnlag'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { useSettSykepengegrunnlag } from '@hooks/mutations/useSettSykepengegrunnlag'
import { cn } from '@utils/tw'
import { Feiloppsummering } from '@components/saksbilde/sykepengegrunnlag/form/Feiloppsummering'
import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { RefusjonFields } from '@components/saksbilde/sykepengegrunnlag/form/RefusjonFields'

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
                                        id={`inntekter-${index}-kilde`}
                                        size="small"
                                        label="Kilde"
                                        value={field.value}
                                        error={fieldState.error?.message != undefined}
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
                            id="begrunnelse"
                            value={field.value ?? ''}
                            className="mt-2 w-[640px]"
                            size="small"
                            label="Begrunnelse"
                            description={
                                <span>Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.</span>
                            }
                            maxLength={1000}
                            minRows={6}
                            error={fieldState.error?.message != undefined}
                        />
                    )}
                />
                {Object.values(form.formState.errors).length > 0 && <Feiloppsummering errors={form.formState.errors} />}
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
