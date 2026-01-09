import { z } from 'zod/v4'
import { Dispatch, ReactElement, SetStateAction, useRef } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BodyShort, Button, Dialog, Textarea, VStack } from '@navikt/ds-react'

import { TilkommenInntektResponse } from '@schemas/tilkommenInntekt'
import { useSlettTilkommenInntekt } from '@hooks/mutations/useSlettTilkommenInntekt'
import { getFormattedDateString } from '@utils/date-format'

interface SlettTilkommenDialogProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    tilkommenInntekt: TilkommenInntektResponse
}

export function SlettTilkommenDialog({ open, setOpen, tilkommenInntekt }: SlettTilkommenDialogProps): ReactElement {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const mutation = useSlettTilkommenInntekt()
    const form = useForm<SlettTilkommenInntektSchema>({
        resolver: zodResolver(slettTilkommenInntektSchema),
        defaultValues: {
            tilkommenInntektId: tilkommenInntekt.id,
            begrunnelse: '',
        },
    })

    async function onSubmit(values: SlettTilkommenInntektSchema) {
        // TODO: Begrunnelsen sendes ikke med til bakrommet sånn det er nå - se useSlettTilkommenInntekt
        await mutation.mutateAsync(values, {
            onSuccess: () => {
                setOpen(false)
            },
        })
    }

    const periodeTekst = `${getFormattedDateString(tilkommenInntekt.fom)} - ${getFormattedDateString(tilkommenInntekt.tom)}`

    return (
        <Dialog open={open} onOpenChange={setOpen} aria-label="Slett tilkommen inntekt-periode">
            <Dialog.Popup id="slett-tilkommen-dialog-popup" initialFocusTo={textareaRef}>
                <Dialog.Header>
                    <Dialog.Title>Fjern periode</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <FormProvider {...form}>
                        <VStack
                            as="form"
                            role="form"
                            id="slett-tilkommen-form"
                            gap="4"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <BodyShort>Vil du fjerne perioden {periodeTekst}?</BodyShort>
                            <Controller
                                control={form.control}
                                name="begrunnelse"
                                render={({ field, fieldState }) => (
                                    <Textarea
                                        {...field}
                                        ref={textareaRef}
                                        value={field.value ?? ''}
                                        size="small"
                                        label="Begrunn hvorfor perioden fjernes"
                                        description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
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
                    <Button form="slett-tilkommen-form" variant="primary" loading={form.formState.isSubmitting}>
                        Slett
                    </Button>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    )
}

const slettTilkommenInntektSchema = z.object({
    tilkommenInntektId: z.string(),
    begrunnelse: z.string(),
})
type SlettTilkommenInntektSchema = z.infer<typeof slettTilkommenInntektSchema>
