'use client'

import { ReactElement } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, HStack, Radio, RadioGroup, Textarea } from '@navikt/ds-react'
import { capitalize } from 'remeda'

import { Vilkår } from '@components/saksbilde/vilkårsvurdering/kodeverk'
import { vilkårsvurderingSchema, VilkårsvurderingSchema } from '@schemas/vilkårsvurdering'

export function VilkårsvurderingForm({ vilkår }: { vilkår: Vilkår }): ReactElement {
    const form = useForm<VilkårsvurderingSchema>({
        resolver: zodResolver(vilkårsvurderingSchema),
        defaultValues: {
            vilkårskode: vilkår.vilkårskode,
            status: '',
            årsak: '',
            notat: '',
        },
    })

    async function onSubmit(values: VilkårsvurderingSchema) {
        // do mutation
        console.log(values)
    }

    const selectedVurdering = form.watch('status')

    return (
        <FormProvider {...form}>
            <form role="form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 px-10">
                <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <RadioGroup
                            size="small"
                            legend="Er vilkåret oppfylt?"
                            value={field.value}
                            onChange={(val) => {
                                field.onChange(val)
                                form.setValue('årsak', '')
                            }}
                        >
                            {Object.keys(vilkår.mulige_resultater).map((vurdering) => (
                                <Radio key={vurdering} value={vurdering}>
                                    {capitalize(vurdering)}
                                </Radio>
                            ))}
                            <Radio value="IKKE_RELEVANT">Ikke relevant</Radio>
                        </RadioGroup>
                    )}
                />
                {selectedVurdering !== 'IKKE_RELEVANT' && selectedVurdering !== '' && (
                    <Controller
                        control={form.control}
                        name="årsak"
                        render={({ field }) => {
                            const vurderingKey = selectedVurdering as keyof typeof vilkår.mulige_resultater
                            const årsaker = vilkår.mulige_resultater[vurderingKey] ?? []

                            return (
                                <RadioGroup
                                    size="small"
                                    legend="Begrunnelse"
                                    value={field.value}
                                    onChange={field.onChange}
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
                            label="Notat til beslutter"
                            description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                            size="small"
                            minRows={5}
                        />
                    )}
                />
                <HStack gap="4">
                    <Button variant="primary" size="small" type="submit">
                        Lagre
                    </Button>
                    <Button variant="tertiary" size="small" type="button" onClick={() => form.reset()}>
                        Avbryt
                    </Button>
                </HStack>
            </form>
        </FormProvider>
    )
}
