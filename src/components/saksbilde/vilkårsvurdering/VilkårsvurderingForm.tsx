'use client'

import { ReactElement } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, HStack, Radio, RadioGroup, Textarea } from '@navikt/ds-react'

import { Vilkår } from '@components/saksbilde/vilkårsvurdering/kodeverk'
import { vilkårsvurderingSchema, VilkårsvurderingSchema } from '@schemas/vilkårsvurdering'
import { useOpprettVilkaarsvurdering } from '@hooks/mutations/useOpprettVilkaarsvurdering'
import { Vilkaarsvurdering, Vurdering } from '@schemas/vilkaarsvurdering'

interface VilkårsvurderingFormProps {
    vilkår: Vilkår
    vurdering?: Vilkaarsvurdering
    nesteAction: () => void
}

export function VilkårsvurderingForm({ vilkår, vurdering, nesteAction }: VilkårsvurderingFormProps): ReactElement {
    const mutation = useOpprettVilkaarsvurdering()
    const form = useForm<VilkårsvurderingSchema>({
        resolver: zodResolver(vilkårsvurderingSchema),
        defaultValues: {
            vilkårskode: vilkår.vilkårskode,
            vurdering: vurdering?.vurdering ?? '',
            årsak: vurdering?.årsak ?? '',
            notat: vurdering?.notat ?? '',
        },
    })

    async function onSubmit(values: VilkårsvurderingSchema) {
        // Ekstra validering: sjekk om årsak er påkrevd
        const selectedVurdering = values.vurdering as keyof typeof vilkår.mulige_resultater
        const årsaker = vilkår.mulige_resultater[selectedVurdering] ?? []

        if (selectedVurdering !== 'SKAL_IKKE_VURDERES' && årsaker.length > 0 && !values.årsak) {
            form.setError('årsak', { message: 'Du må velge en begrunnelse' })
            return
        }

        await mutation.mutateAsync({
            kode: values.vilkårskode,
            vurdering: values.vurdering as Vurdering,
            årsak: values.årsak ?? '',
            notat: values.notat,
        })
    }

    const selectedVurdering = form.watch('vurdering')

    return (
        <FormProvider {...form}>
            <form role="form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 px-10">
                <Controller
                    control={form.control}
                    name="vurdering"
                    render={({ field, fieldState }) => (
                        <RadioGroup
                            size="small"
                            legend={vilkår.spørsmålstekst || 'Er vilkåret oppfylt?'}
                            value={field.value}
                            onChange={(val) => {
                                field.onChange(val)
                                form.setValue('årsak', '')
                                form.clearErrors('årsak')
                                form.setValue('notat', '')
                            }}
                            error={fieldState.error?.message}
                        >
                            {Object.keys(vilkår.mulige_resultater).map((vurdering) => (
                                <Radio key={vurdering} value={vurdering}>
                                    {vurderingVisningsTekst[vurdering as Vurdering]}
                                </Radio>
                            ))}
                        </RadioGroup>
                    )}
                />
                {selectedVurdering !== '' && selectedVurdering !== 'SKAL_IKKE_VURDERES' && (
                    <Controller
                        control={form.control}
                        name="årsak"
                        render={({ field, fieldState }) => {
                            const vurderingKey = selectedVurdering as keyof typeof vilkår.mulige_resultater
                            const årsaker = vilkår.mulige_resultater[vurderingKey] ?? []

                            // Ikke vis begrunnelse-seksjonen hvis det ikke finnes noen årsaker å velge mellom
                            if (årsaker.length === 0) {
                                return <></>
                            }

                            return (
                                <RadioGroup
                                    size="small"
                                    legend="Begrunnelse"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                >
                                    {årsaker.map((årsak) => (
                                        <Radio key={årsak.kode} value={årsak.kode}>
                                            {årsak.beskrivelse}
                                        </Radio>
                                    ))}
                                </RadioGroup>
                            )
                        }}
                    />
                )}
                <Controller
                    control={form.control}
                    name="notat"
                    render={({ field, fieldState }) => (
                        <Textarea
                            {...field}
                            error={fieldState.error?.message}
                            label="Utvidet begrunnelse"
                            description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                            size="small"
                            minRows={5}
                        />
                    )}
                />
                <HStack gap="4">
                    <Button variant="primary" size="small" type="submit" loading={form.formState.isSubmitting}>
                        Lagre
                    </Button>
                    <Button
                        variant="tertiary"
                        size="small"
                        type="button"
                        onClick={nesteAction}
                        disabled={form.formState.isSubmitting}
                    >
                        Neste
                    </Button>
                </HStack>
            </form>
        </FormProvider>
    )
}

const vurderingVisningsTekst: Record<Vurdering, string> = {
    OPPFYLT: 'Ja',
    IKKE_OPPFYLT: 'Nei',
    IKKE_RELEVANT: 'Unntak/Ikke relevant',
    SKAL_IKKE_VURDERES: 'Skal ikke vurderes',
}
