import React, { ReactElement } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, HStack, Textarea, VStack } from '@navikt/ds-react'

import { useOppdaterInntekt } from '@hooks/mutations/useOppdaterInntekt'
import { inntektRequestSchema, Inntektskategori } from '@schemas/inntektRequest'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { ArbeidstakerFormFields } from '@components/saksbilde/sykepengegrunnlag/form/ny/ArbeidstakerFormFields'
import { PensjonsgivendeInntektFormFields } from '@components/saksbilde/sykepengegrunnlag/form/ny/PensjonsgivendeInntektFormFields'
import { FrilanserInntektFormFields } from '@components/saksbilde/sykepengegrunnlag/form/ny/FrilanserInntektFormFields'
import { getDefaultValues, InntektRequestFor } from '@components/saksbilde/sykepengegrunnlag/form/ny/defaultValues'
import { ArbeidsledigInntektFormFields } from '@components/saksbilde/sykepengegrunnlag/form/ny/ArbeidsledigInntektFormFields'

type NySykepengegrunnlagFormProps = {
    yrkesaktivitet: Yrkesaktivitet
    avbryt: () => void
}

export function NySykepengegrunnlagForm({ yrkesaktivitet, avbryt }: NySykepengegrunnlagFormProps): ReactElement {
    const mutation = useOppdaterInntekt()
    const kategori = yrkesaktivitet.kategorisering['INNTEKTSKATEGORI'] as Inntektskategori
    const form = useForm<InntektRequestFor<typeof kategori>>({
        resolver: zodResolver(inntektRequestSchema),
        defaultValues: getDefaultValues(kategori, yrkesaktivitet.inntektRequest as InntektRequestFor<typeof kategori>),
    })

    async function onSubmit(values: InntektRequestFor<typeof kategori>) {
        await mutation.mutateAsync({ yrkesaktivitetId: yrkesaktivitet.id, inntektRequest: values }).then(() => {
            form.reset()
            avbryt()
        })
    }

    return (
        <FormProvider {...form}>
            <VStack as="form" role="form" gap="4" onSubmit={form.handleSubmit(onSubmit)}>
                {kategori === 'ARBEIDSTAKER' && <ArbeidstakerFormFields />}
                {kategori === 'SELVSTENDIG_NÆRINGSDRIVENDE' && <PensjonsgivendeInntektFormFields kategori={kategori} />}
                {kategori === 'INAKTIV' && <PensjonsgivendeInntektFormFields kategori={kategori} />}
                {kategori === 'FRILANSER' && <FrilanserInntektFormFields />}
                {kategori === 'ARBEIDSLEDIG' && <ArbeidsledigInntektFormFields />}
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
