import React, { ReactElement } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { BodyShort, Button, Checkbox, CheckboxGroup, HStack, Select, Textarea, TextField } from '@navikt/ds-react'

import { NavnOgIkon } from '@components/saksbilde/sykepengegrunnlag/Sykepengegrunnlag'
import {
    formaterBeløpØre,
    Inntekt,
    inntektskildeSchema,
    kronerTilØrer,
    refusjonsperiodeSchema,
    SykepengegrunnlagResponse,
    ørerTilKroner,
} from '@schemas/sykepengegrunnlag'
import { Inntektsforhold } from '@schemas/inntektsforhold'
import { useSettSykepengegrunnlag } from '@hooks/mutations/useSettSykepengegrunnlag'

export type SykepengegrunnlagFormSchema = z.infer<typeof sykepengegrunnlagFormSchema>
export const sykepengegrunnlagFormSchema = z.object({
    inntektsforhold: z.record(
        z.string(),
        z.object({
            inntekt: z.string(),
            kilde: inntektskildeSchema,
            refusjon: z.array(refusjonsperiodeSchema),
            visRefusjonFelter: z.boolean(),
        }),
    ),
    begrunnelse: z.string(),
})

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
    const mutation = useSettSykepengegrunnlag()
    const form = useForm<SykepengegrunnlagFormSchema>({
        resolver: zodResolver(sykepengegrunnlagFormSchema),
        defaultValues: {
            inntektsforhold: Object.fromEntries(
                inntektsforhold.map((forhold) => {
                    const inntektFraSykepengegrunnlag = sykepengegrunnlag?.inntekter.find(
                        (inntekt) => inntekt.inntektsforholdId === forhold.id,
                    )
                    return [
                        forhold.id,
                        {
                            inntekt: inntektFraSykepengegrunnlag?.beløpPerMånedØre
                                ? ørerTilKroner(inntektFraSykepengegrunnlag.beløpPerMånedØre).toString()
                                : '',
                            kilde: inntektFraSykepengegrunnlag?.kilde ?? 'INNTEKTSMELDING',
                            refusjon: inntektFraSykepengegrunnlag?.refusjon ?? [],
                            visRefusjonFelter:
                                Array.isArray(inntektFraSykepengegrunnlag?.refusjon) &&
                                inntektFraSykepengegrunnlag.refusjon.length > 0,
                        },
                    ]
                }) ?? [],
            ),
            begrunnelse: sykepengegrunnlag?.begrunnelse ?? '',
        },
    })

    async function onSubmit(values: SykepengegrunnlagFormSchema) {
        const inntekter: Inntekt[] = Object.entries(values.inntektsforhold).map(([inntektsforholdId, forhold]) => ({
            inntektsforholdId,
            beløpPerMånedØre: kronerTilØrer(+forhold.inntekt),
            kilde: forhold.kilde,
            refusjon: forhold.refusjon ?? [],
        }))

        await mutation
            .mutateAsync({
                inntekter,
                begrunnelse: values.begrunnelse,
            })
            .then(() => {
                form.reset()
                avbryt()
            })
    }

    return (
        <FormProvider {...form}>
            <form role="form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-nowrap gap-6 pb-6">
                {inntektsforhold.map((forhold) => (
                    <HStack key={forhold.id} align="end" gap="4">
                        <NavnOgIkon orgnummer={forhold.kategorisering['ORGNUMMER'] as string} />
                        <Controller
                            control={form.control}
                            name={`inntektsforhold.${forhold.id}.inntekt`}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    className="ml-auto"
                                    error={fieldState.error?.message}
                                    label="Inntekt"
                                    size="small"
                                />
                            )}
                        />
                        <Controller
                            control={form.control}
                            name={`inntektsforhold.${forhold.id}.kilde`}
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
                        <Controller
                            control={form.control}
                            name={`inntektsforhold.${forhold.id}.visRefusjonFelter`}
                            render={({ field, fieldState }) => (
                                <CheckboxGroup
                                    size="small"
                                    legend="Refusjon"
                                    error={fieldState.error?.message}
                                    value={field.value ? ['ja'] : []}
                                    onChange={(values: string[]) => field.onChange(values.includes('ja'))} // map back to boolean
                                >
                                    <Checkbox value="ja" hideLabel>
                                        Ja
                                    </Checkbox>
                                </CheckboxGroup>
                            )}
                        />
                    </HStack>
                ))}
                <span className="border-t border-t-ax-bg-neutral-strong" />
                <HStack justify="space-between">
                    <BodyShort weight="semibold">Totalt</BodyShort>
                    <BodyShort>{formaterBeløpØre(sykepengegrunnlag?.totalInntektØre)}</BodyShort>
                </HStack>
                <Controller
                    control={form.control}
                    name="begrunnelse"
                    render={({ field, fieldState }) => (
                        <Textarea
                            {...field}
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
                        loading={form.formState.isSubmitting}
                    >
                        Avbryt
                    </Button>
                </HStack>
            </form>
        </FormProvider>
    )
}
