import { ReactElement } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, HStack } from '@navikt/ds-react'
import { XMarkIcon } from '@navikt/aksel-icons'
import { zodResolver } from '@hookform/resolvers/zod'

import { skjæringstidspunktSchema, SkjæringstidspunktSchema } from '@schemas/skjæringstidspunkt'
import { useOppdaterSkjæringstidspunkt } from '@hooks/mutations/useOppdaterSkjæringstidspunkt'
import { DateField } from '@components/saksbilde/sykepengegrunnlag/form/DateField'

interface SkjæringstidspunktFormProps {
    dato: string
    saksbehandlingsperiodeId: string
    avbryt: () => void
}

export function SkjæringstidspunktForm({
    dato,
    saksbehandlingsperiodeId,
    avbryt,
}: SkjæringstidspunktFormProps): ReactElement {
    const mutation = useOppdaterSkjæringstidspunkt()
    const form = useForm<SkjæringstidspunktSchema>({
        resolver: zodResolver(skjæringstidspunktSchema),
        defaultValues: {
            skjæringstidspunkt: dato,
            saksbehandlingsperiodeId: saksbehandlingsperiodeId,
        },
    })

    function lukkForm() {
        form.reset()
        avbryt()
    }

    async function onSubmit(values: SkjæringstidspunktSchema) {
        await mutation.mutateAsync(values).then(() => lukkForm())
    }

    return (
        <FormProvider {...form}>
            <HStack as="form" gap="2" role="form" onSubmit={form.handleSubmit(onSubmit)}>
                <DateField name="skjæringstidspunkt" label="Skjæringstidspunkt" hideLabel showErrorMessage />
                <HStack gap="2" align="center" className="h-8" wrap={false}>
                    <Button type="submit" size="small" variant="secondary" loading={form.formState.isSubmitting}>
                        Lagre
                    </Button>
                    <Button
                        type="button"
                        size="small"
                        variant="tertiary"
                        icon={<XMarkIcon />}
                        onClick={lukkForm}
                        disabled={form.formState.isSubmitting}
                    />
                </HStack>
            </HStack>
        </FormProvider>
    )
}
