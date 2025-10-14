import React, { ReactElement } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { Button, HStack, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react'

import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'

export type EnFormSchema = z.infer<typeof enFormSchema>
export const enFormSchema = z.object({
    beløpPerMånedØre: z.number({ error: 'Inntekt må være et tall' }).int().min(0), // Beløp i øre
    inntektskilde: z.enum(['AINNTEKT', 'INNTEKTSMELDING', 'MANUELT_FASTSATT', 'SKJONNSFASTSETTELSE', ''], {
        error: 'Dette valget er ikke en del av schema. Kontakt en utvikler',
    }),
    skjønnsfastsettelseÅrsak: z.enum(['ÅRSAK1', 'ÅRSAK2', 'ÅRSAK3']).optional(),
    begrunnelse: z.string().optional(),
})

export function EnForm(): ReactElement {
    const form = useForm<EnFormSchema>({
        resolver: zodResolver(enFormSchema),
        defaultValues: {
            beløpPerMånedØre: 0,
            inntektskilde: '',
            skjønnsfastsettelseÅrsak: 'ÅRSAK1',
            begrunnelse: '',
        },
    })

    async function onSubmit(values: EnFormSchema) {
        console.log(values)
        // await mutation.mutateAsync(values).then(() => {
        //     form.reset()
        //     avbryt()
        // })
    }

    const valgtInntektskilde = form.watch('inntektskilde')

    return (
        <FormProvider {...form}>
            <VStack as="form" role="form" gap="4" onSubmit={form.handleSubmit(onSubmit)}>
                <Controller
                    control={form.control}
                    name="inntektskilde"
                    render={({ field, fieldState }) => (
                        <RadioGroup {...field} legend="Velg kilde for inntektsdata" size="small">
                            <Radio value="INNTEKTSMELDING">Inntektsmelding</Radio>
                            <Radio value="AINNTEKT">Hent fra A-inntekt</Radio>
                            <Radio value="SKJONNSFASTSETTELSE">Skjønnsfastsatt</Radio>
                            <Radio value="MANUELT_FASTSATT">Manuelt fastsatt grunnet ingen systemstøtte</Radio>
                        </RadioGroup>
                    )}
                />
                {(valgtInntektskilde === 'SKJONNSFASTSETTELSE' || valgtInntektskilde === 'MANUELT_FASTSATT') && (
                    <PengerField className="w-[212px]" name="beløpPerMånedØre" label="Månedsbeløp" />
                )}
                {valgtInntektskilde === 'SKJONNSFASTSETTELSE' && (
                    <Controller
                        control={form.control}
                        name="skjønnsfastsettelseÅrsak"
                        render={({ field, fieldState }) => (
                            <RadioGroup {...field} legend="Årsak til skjønnsfastsettelse" size="small">
                                <Radio value="ÅRSAK1">
                                    Skjønnsfastsettelse ved mer enn 25 % avvik (§ 8-30 andre ledd)
                                </Radio>
                                <Radio value="ÅRSAK2">
                                    Skjønnsfastsettelse ved mangelfull eller uriktig rapportering (§ 8-30 tredje ledd)
                                </Radio>
                                <Radio value="ÅRSAK3">
                                    Skjønnsfastsettelse ved tidsbegrenset arbeidsforhold under 6 måneder (§ 8-30 fjerde
                                    ledd)
                                </Radio>
                            </RadioGroup>
                        )}
                    />
                )}
                <Controller
                    control={form.control}
                    name="begrunnelse"
                    render={({ field, fieldState }) => (
                        <Textarea
                            {...field}
                            id="begrunnelse"
                            value={field.value ?? ''}
                            className="w-[640px]"
                            size="small"
                            label="Begrunnelse"
                            description={
                                <span>Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.</span>
                            }
                            maxLength={1000}
                            minRows={6}
                            // error={fieldState.error?.message != undefined}
                        />
                    )}
                />
                <HStack gap="2" align="center" className="h-8" wrap={false}>
                    <Button type="submit" size="small" loading={form.formState.isSubmitting}>
                        Lagre
                    </Button>
                    <Button
                        type="button"
                        size="small"
                        variant="secondary"
                        onClick={() => {}}
                        disabled={form.formState.isSubmitting}
                    >
                        Avbryt
                    </Button>
                </HStack>
            </VStack>
        </FormProvider>
    )
}
