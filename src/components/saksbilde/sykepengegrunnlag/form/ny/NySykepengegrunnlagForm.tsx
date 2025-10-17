import React, { ReactElement } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, HStack, Textarea, VStack } from '@navikt/ds-react'

import { useOppdaterInntekt } from '@hooks/mutations/useOppdaterInntekt'
import { InntektRequest, inntektRequestSchema, Inntektskategori } from '@schemas/inntektRequest'
import { ArbeidstakerInntektFormFields } from '@components/saksbilde/sykepengegrunnlag/form/ny/arbeidstaker/ArbeidstakerInntektFormFields'
import { PensjonsgivendeInntektFormFields } from '@components/saksbilde/sykepengegrunnlag/form/ny/pensjonsgivende/PensjonsgivendeInntektFormFields'
import { FrilanserInntektFormFields } from '@components/saksbilde/sykepengegrunnlag/form/ny/frilanser/FrilanserInntektFormFields'
import { getDefaultValues, InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/ny/defaultValues'
import { ArbeidsledigInntektFormFields } from '@components/saksbilde/sykepengegrunnlag/form/ny/arbeidsledig/ArbeidsledigInntektFormFields'

type NySykepengegrunnlagFormProps = {
    kategori: Inntektskategori
    inntektRequest: InntektRequest
    yrkesaktivitetId: string
    avbryt: () => void
}

export function NySykepengegrunnlagForm({
    kategori,
    inntektRequest,
    yrkesaktivitetId,
    avbryt,
}: NySykepengegrunnlagFormProps): ReactElement {
    const mutation = useOppdaterInntekt()
    const form = useForm<InntektRequestFor<typeof kategori>>({
        resolver: zodResolver(inntektRequestSchema),
        defaultValues: getDefaultValues(kategori, inntektRequest as InntektRequestFor<typeof kategori>),
    })

    async function onSubmit(inntektRequest: InntektRequestFor<typeof kategori>) {
        await mutation.mutateAsync({ yrkesaktivitetId, inntektRequest }).then(() => {
            form.reset()
            avbryt()
        })
    }

    return (
        <FormProvider {...form}>
            <VStack as="form" role="form" gap="4" onSubmit={form.handleSubmit(onSubmit)}>
                {FormFieldsFor[kategori]}
                <Controller
                    control={form.control}
                    name="data.begrunnelse"
                    render={({ field, fieldState }) => (
                        <Textarea
                            {...field}
                            value={field.value ?? ''}
                            className="w-[640px]"
                            size="small"
                            label="Begrunnelse"
                            description="Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn."
                            maxLength={1000}
                            minRows={6}
                            error={fieldState.error?.message}
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
                        onClick={() => {
                            form.reset()
                            avbryt()
                        }}
                        disabled={form.formState.isSubmitting}
                    >
                        Avbryt
                    </Button>
                </HStack>
            </VStack>
        </FormProvider>
    )
}

const FormFieldsFor: Record<Inntektskategori, ReactElement> = {
    ARBEIDSTAKER: <ArbeidstakerInntektFormFields />,
    SELVSTENDIG_NÆRINGSDRIVENDE: <PensjonsgivendeInntektFormFields kategori="SELVSTENDIG_NÆRINGSDRIVENDE" />,
    INAKTIV: <PensjonsgivendeInntektFormFields kategori="INAKTIV" />,
    FRILANSER: <FrilanserInntektFormFields />,
    ARBEIDSLEDIG: <ArbeidsledigInntektFormFields />,
}
