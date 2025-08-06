import { ReactElement } from 'react'
import { z } from 'zod'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading, HStack, Select, Textarea, TextField } from '@navikt/ds-react'

import { useOppdaterInntektsforholdDagoversikt } from '@hooks/mutations/useOppdaterInntektsforhold'
import { Dag, Dagtype, dagtypeSchema } from '@schemas/dagoversikt'
import { Inntektsforhold } from '@schemas/inntektsforhold'

export type DagendringSchema = z.infer<typeof dagendringSchema>
export const dagendringSchema = z.object({
    dagtype: dagtypeSchema,
    grad: z.string(),
    notat: z.string(),
})

type DagendringFormProps = {
    aktivtInntektsForhold?: Inntektsforhold
    valgteDataer: Set<string>
    avbryt: () => void
}

export function DagendringForm({ aktivtInntektsForhold, valgteDataer, avbryt }: DagendringFormProps): ReactElement {
    const mutation = useOppdaterInntektsforholdDagoversikt()
    const form = useForm<DagendringSchema>({
        resolver: zodResolver(dagendringSchema),
        defaultValues: {
            dagtype: 'Syk',
            grad: '100',
            notat: '',
        },
    })

    async function onSubmit(values: DagendringSchema) {
        if (!aktivtInntektsForhold || valgteDataer.size === 0) return

        const { dagtype, grad, notat } = values

        const oppdaterteDager: Dag[] = []

        // Opprett kun de dagene som skal oppdateres
        valgteDataer.forEach((dato) => {
            const eksisterendeDag = aktivtInntektsForhold.dagoversikt?.find((d) => d.dato === dato)
            if (eksisterendeDag) {
                oppdaterteDager.push({
                    ...eksisterendeDag,
                    dagtype: dagtype,
                    grad: dagtype === 'Syk' || dagtype === 'SykNav' ? parseInt(grad) : null,
                    kilde: 'Saksbehandler',
                })
            }
        })

        await mutation
            .mutateAsync({
                inntektsforholdId: aktivtInntektsForhold.id,
                dager: oppdaterteDager,
                notat,
            })
            .then(() => {
                form.reset()
                avbryt()
            })
    }

    const nyGrad = form.watch('grad')
    const nyDagtype = form.watch('dagtype')

    return (
        <FormProvider {...form}>
            <form role="form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-8">
                <Heading size="small">
                    {valgteDataer.size > 0
                        ? `Fyll inn hva de ${valgteDataer.size} valgte dagene skal endres til`
                        : 'Velg én eller flere dager du vil endre i tabellen ovenfor'}
                </Heading>
                <HStack gap="4">
                    <Controller
                        control={form.control}
                        name="dagtype"
                        render={({ field, fieldState }) => (
                            <Select
                                size="small"
                                disabled={valgteDataer.size === 0}
                                label="Dagtype"
                                value={field.value}
                                error={fieldState.error?.message}
                                onChange={(val) => {
                                    const valgtDagtype = val.target.value as Dagtype

                                    field.onChange(valgtDagtype)

                                    // Sett grad til standardverdi når man velger dagtype som støtter grad
                                    if (valgtDagtype === 'Syk' || valgtDagtype === 'SykNav') {
                                        if (!nyGrad) {
                                            form.setValue('grad', '100')
                                        }
                                    } else {
                                        form.setValue('grad', '')
                                    }
                                }}
                            >
                                <option value="Syk">Syk</option>
                                <option value="SykNav">Syk (NAV)</option>
                                <option value="Arbeidsdag">Arbeidsdag</option>
                                <option value="Ferie">Ferie</option>
                                <option value="Permisjon">Permisjon</option>
                                <option value="Avvist">Avvist</option>
                            </Select>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="grad"
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                className="max-w-12"
                                error={fieldState.error?.message}
                                label="Grad"
                                size="small"
                                disabled={valgteDataer.size === 0 || (nyDagtype !== 'Syk' && nyDagtype !== 'SykNav')}
                            />
                        )}
                    />
                </HStack>
                <Controller
                    control={form.control}
                    name="notat"
                    render={({ field, fieldState }) => (
                        <Textarea
                            {...field}
                            className="mt-2 w-[640px]"
                            size="small"
                            label="Notat til beslutter"
                            description={
                                <span>
                                    Begrunn hvorfor det er gjort endringer i sykdomstidslinjen. <br />
                                    Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.
                                </span>
                            }
                            maxLength={1000}
                            minRows={6}
                            disabled={valgteDataer.size === 0}
                            error={fieldState.error?.message}
                        />
                    )}
                />
                <HStack gap="2" className="mt-4">
                    <Button
                        size="small"
                        type="submit"
                        loading={form.formState.isSubmitting}
                        disabled={valgteDataer.size === 0}
                    >
                        Endre ({valgteDataer.size})
                    </Button>
                    <Button
                        size="small"
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            form.reset()
                            avbryt()
                        }}
                        loading={form.formState.isSubmitting}
                    >
                        Avbryt
                    </Button>
                </HStack>
            </form>
        </FormProvider>
    )
}
