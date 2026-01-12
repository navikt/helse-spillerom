import z from 'zod/v4'
import { Dispatch, SetStateAction, useRef } from 'react'
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BodyShort, Button, Dialog, Textarea, VStack } from '@navikt/ds-react'

import { useSendTilbake } from '@hooks/mutations/useSendTilbake'
import { useToast } from '@components/ToastProvider'

interface SendTilbakeModalProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    aktivBehandlingId: string
}

export function SendTilbakeModal({ open, setOpen, aktivBehandlingId }: SendTilbakeModalProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { visToast } = useToast()
    const mutation = useSendTilbake()
    const form = useForm<SendIReturSchema>({
        resolver: zodResolver(sendIReturSchema),
        defaultValues: {
            behandlingId: aktivBehandlingId,
            kommentar: '',
        },
    })

    const kommentar = useWatch({ control: form.control, name: 'kommentar' })

    async function onSubmit(values: SendIReturSchema) {
        await mutation.mutateAsync(values, {
            onSuccess: () => {
                visToast('Saken er sendt tilbake til saksbehandler', 'success')
                setOpen(false)
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} aria-label="Returner sak til saksbehandler">
            <Dialog.Popup initialFocusTo={textareaRef}>
                <Dialog.Header>
                    <Dialog.Title>Returner sak til saksbehandler</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <FormProvider {...form}>
                        <VStack
                            as="form"
                            role="form"
                            id="send-i-retur-form"
                            gap="4"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <BodyShort size="small" className="text-gray-700">
                                Forklar hvorfor oppgaven sendes tilbake på en enkel måte, slik at det er lett å forstå
                                hva som må vurderes og gjøres annerledes. (Blir ikke forevist den sykmeldte, med mindre
                                hen ber om innsyn)
                            </BodyShort>
                            <Controller
                                control={form.control}
                                name="kommentar"
                                render={({ field, fieldState }) => (
                                    <Textarea
                                        {...field}
                                        ref={textareaRef}
                                        value={field.value ?? ''}
                                        label="Kommentar"
                                        placeholder="Skriv inn kommentar til saksbehandler..."
                                        minRows={5}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                        </VStack>
                    </FormProvider>
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button type="button" variant="secondary" disabled={form.formState.isSubmitting}>
                            Avbryt
                        </Button>
                    </Dialog.CloseTrigger>
                    <Button
                        form="send-i-retur-form"
                        variant="primary"
                        loading={form.formState.isSubmitting}
                        disabled={!kommentar.trim()}
                    >
                        Lagre notat og returner
                    </Button>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    )
}

const sendIReturSchema = z.object({
    behandlingId: z.string(),
    kommentar: z.string(),
})
type SendIReturSchema = z.infer<typeof sendIReturSchema>
