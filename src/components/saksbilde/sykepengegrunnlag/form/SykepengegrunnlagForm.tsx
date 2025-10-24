import React, { ReactElement } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, HStack, Textarea, VStack } from '@navikt/ds-react'

import { useOppdaterInntekt } from '@hooks/mutations/useOppdaterInntekt'
import { InntektRequest, inntektRequestSchema, Inntektskategori } from '@schemas/inntektRequest'
import { ArbeidstakerInntektFormFields } from '@components/saksbilde/sykepengegrunnlag/form/arbeidstaker/ArbeidstakerInntektFormFields'
import { PensjonsgivendeInntektFormFields } from '@components/saksbilde/sykepengegrunnlag/form/pensjonsgivende/PensjonsgivendeInntektFormFields'
import { FrilanserInntektFormFields } from '@components/saksbilde/sykepengegrunnlag/form/frilanser/FrilanserInntektFormFields'
import { getDefaultValues, InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/defaultValues'
import { ArbeidsledigInntektFormFields } from '@components/saksbilde/sykepengegrunnlag/form/arbeidsledig/ArbeidsledigInntektFormFields'

type SykepengegrunnlagFormProps = {
    kategori: Inntektskategori
    inntektRequest: InntektRequest
    yrkesaktivitetId: string
    avbryt: () => void
    erFørstegangsRedigering?: boolean
}

export function SykepengegrunnlagForm({
    kategori,
    inntektRequest,
    yrkesaktivitetId,
    avbryt,
    erFørstegangsRedigering = false,
}: SykepengegrunnlagFormProps): ReactElement {
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

    const FormFields = FormFieldsFor[kategori]

    return (
        <FormProvider {...form}>
            <VStack as="form" role="form" gap="4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormFields yrkesaktivitetId={yrkesaktivitetId} kategori={kategori} />
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
                    {!erFørstegangsRedigering && (
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
                    )}
                </HStack>
            </VStack>
        </FormProvider>
    )
}

type FormFieldsProps = { yrkesaktivitetId: string; kategori: Inntektskategori }

const FormFieldsFor: Record<Inntektskategori, React.ComponentType<FormFieldsProps>> = {
    ARBEIDSTAKER: ArbeidstakerInntektFormFields as React.ComponentType<FormFieldsProps>,
    SELVSTENDIG_NÆRINGSDRIVENDE: PensjonsgivendeInntektFormFields,
    INAKTIV: PensjonsgivendeInntektFormFields,
    FRILANSER: FrilanserInntektFormFields as React.ComponentType<FormFieldsProps>,
    ARBEIDSLEDIG: ArbeidsledigInntektFormFields as React.ComponentType<FormFieldsProps>,
}
