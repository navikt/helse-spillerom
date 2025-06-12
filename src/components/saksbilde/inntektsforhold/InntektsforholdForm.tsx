import { ReactElement } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading, HStack, Select, Switch, TextField } from '@navikt/ds-react'

import { Inntektsforhold as InntektsforholdSchema, inntektsforholdSchema } from '@schemas/inntektsforhold'
import { useOpprettInntektsforhold } from '@hooks/mutations/useOpprettInntektsforhold'

export function InntektsforholdForm({ closeForm }: { closeForm: () => void }): ReactElement {
    const mutation = useOpprettInntektsforhold()
    const form = useForm<InntektsforholdSchema>({
        resolver: zodResolver(inntektsforholdSchema),
        defaultValues: {
            id: '',
            inntektsforholdtype: 'ORDINÆRT_ARBEIDSFORHOLD',
            sykmeldtFraForholdet: false,
            orgnummer: '',
            orgnavn: '',
        },
    })

    async function onSubmit(values: InntektsforholdSchema) {
        await mutation.mutateAsync(
            {
                inntektsforholdtype: values.inntektsforholdtype,
                sykmeldtFraForholdet: values.sykmeldtFraForholdet,
                orgnummer: values.orgnummer,
            },
            {
                onSuccess: () => {
                    closeForm()
                },
            },
        )
    }

    const inntektsforholdtype = form.watch('inntektsforholdtype')

    return (
        <FormProvider {...form}>
            <form role="form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <Heading size="small">Opprett nytt inntektsforhold</Heading>
                <Controller
                    control={form.control}
                    name="inntektsforholdtype"
                    render={({ field, fieldState }) => (
                        <Select
                            {...field}
                            className="max-w-96"
                            label="Inntektsforholdtype"
                            error={fieldState.error?.message}
                        >
                            <option value="ORDINÆRT_ARBEIDSFORHOLD">Ordinært arbeidsforhold</option>
                            <option value="FRILANSER">Frilanser</option>
                            <option value="SELVSTENDIG_NÆRINGSDRIVENDE">Selvstendig næringsdrivende</option>
                            <option value="ARBEIDSLEDIG">Arbeidsledig</option>
                        </Select>
                    )}
                />
                {inntektsforholdtype !== 'ARBEIDSLEDIG' && (
                    <Controller
                        control={form.control}
                        name="orgnummer"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                className="max-w-96"
                                label="Organisasjonsnummer"
                                placeholder="123456789"
                                description="9-sifret organisasjonsnummer"
                                error={fieldState.error?.message}
                            />
                        )}
                    />
                )}
                <Controller
                    control={form.control}
                    name="sykmeldtFraForholdet"
                    render={({ field }) => (
                        <Switch checked={field.value} onChange={field.onChange}>
                            Sykmeldt fra forholdet
                        </Switch>
                    )}
                />
                <HStack gap="4">
                    <Button variant="primary" size="small" type="submit" loading={form.formState.isSubmitting}>
                        Opprett
                    </Button>
                    <Button
                        variant="tertiary"
                        size="small"
                        type="button"
                        disabled={form.formState.isSubmitting}
                        onClick={() => closeForm()}
                    >
                        Avbryt
                    </Button>
                </HStack>
            </form>
        </FormProvider>
    )
}
