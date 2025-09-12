import { ReactElement } from 'react'
import { z } from 'zod/v4'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Checkbox, CheckboxGroup, Heading, HStack, Select, Textarea, TextField } from '@navikt/ds-react'

import { useOppdaterYrkesaktivitetDagoversikt } from '@hooks/mutations/useOppdaterYrkesaktivitet'
import { andreYtelserBegrunnelseSchema, Dag, Dagtype, dagtypeSchema } from '@schemas/dagoversikt'
import { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { useTilgjengeligeAvslagsdager } from '@components/saksbilde/vilkårsvurdering/useTilgjengeligeAvslagsdager'

export type DagendringSchema = z.infer<typeof dagendringSchema>
export const dagendringSchema = z.object({
    dagtype: dagtypeSchema,
    grad: z.string(),
    notat: z.string(),
    andreYtelserType: andreYtelserBegrunnelseSchema,
    avslåttBegrunnelse: z.string().optional(),
    avslåttBegrunnelser: z.array(z.string()).optional(),
})

type DagendringFormProps = {
    aktivtInntektsForhold?: Yrkesaktivitet
    valgteDataer: Set<string>
    avbryt: () => void
}

export function DagendringForm({ aktivtInntektsForhold, valgteDataer, avbryt }: DagendringFormProps): ReactElement {
    const mutation = useOppdaterYrkesaktivitetDagoversikt()
    const tilgjengeligeAvslagsdager = useTilgjengeligeAvslagsdager()
    const form = useForm<DagendringSchema>({
        resolver: zodResolver(dagendringSchema),
        defaultValues: {
            dagtype: 'Syk',
            grad: '100',
            notat: '',
            andreYtelserType: 'AndreYtelserAap',
            avslåttBegrunnelse: tilgjengeligeAvslagsdager.length === 1 ? tilgjengeligeAvslagsdager[0]?.kode || '' : '',
            avslåttBegrunnelser: [],
        },
    })

    async function onSubmit(values: DagendringSchema) {
        if (!aktivtInntektsForhold || valgteDataer.size === 0) return

        const { dagtype, grad, notat, andreYtelserType, avslåttBegrunnelse, avslåttBegrunnelser } = values

        const oppdaterteDager: Dag[] = []

        // Opprett kun de dagene som skal oppdateres
        valgteDataer.forEach((dato) => {
            const eksisterendeDag = aktivtInntektsForhold.dagoversikt?.find((d) => d.dato === dato)
            if (eksisterendeDag) {
                oppdaterteDager.push({
                    ...eksisterendeDag,
                    dagtype: dagtype,
                    grad: dagtype === 'Syk' || dagtype === 'SykNav' ? parseInt(grad) : null,
                    andreYtelserBegrunnelse: dagtype === 'AndreYtelser' ? [andreYtelserType] : undefined,
                    avslåttBegrunnelse:
                        dagtype === 'Avslått'
                            ? avslåttBegrunnelse
                                ? [avslåttBegrunnelse]
                                : avslåttBegrunnelser || []
                            : undefined,
                    kilde: 'Saksbehandler',
                })
            }
        })

        await mutation
            .mutateAsync({
                yrkesaktivitetId: aktivtInntektsForhold.id,
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
                                <option value="Ventetid">Ventetid</option>
                                <option value="Ferie">Ferie</option>
                                <option value="Permisjon">Permisjon</option>
                                {tilgjengeligeAvslagsdager.length > 0 && (
                                    <option value="Avslått">
                                        {tilgjengeligeAvslagsdager.length === 1
                                            ? `Avslått (${tilgjengeligeAvslagsdager[0].beskrivelse})`
                                            : 'Avslått'}
                                    </option>
                                )}
                                <option value="AndreYtelser">Andre ytelser</option>
                            </Select>
                        )}
                    />
                    {nyDagtype === 'AndreYtelser' && (
                        <Controller
                            control={form.control}
                            name="andreYtelserType"
                            render={({ field, fieldState }) => (
                                <Select
                                    {...field}
                                    size="small"
                                    disabled={valgteDataer.size === 0}
                                    label="Type"
                                    error={fieldState.error?.message}
                                >
                                    <option value="AndreYtelserAap">AAP</option>
                                    <option value="AndreYtelserDagpenger">Dagpenger</option>
                                    <option value="AndreYtelserForeldrepenger">Foreldrepenger</option>
                                    <option value="AndreYtelserOmsorgspenger">Omsorgspenger</option>
                                    <option value="AndreYtelserOpplaringspenger">Opplæringspenger</option>
                                    <option value="AndreYtelserPleiepenger">Pleiepenger</option>
                                    <option value="AndreYtelserSvangerskapspenger">Svangerskapspenger</option>
                                </Select>
                            )}
                        />
                    )}

                    {(nyDagtype == 'Syk' || nyDagtype == 'SykNav') && (
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
                                />
                            )}
                        />
                    )}
                </HStack>
                {nyDagtype === 'Avslått' && tilgjengeligeAvslagsdager.length > 1 && (
                    <Controller
                        control={form.control}
                        name="avslåttBegrunnelser"
                        rules={{
                            required: 'Du må velge minst én avslagsbegrunnelse',
                            validate: (value) =>
                                (value && value.length > 0) || 'Du må velge minst én avslagsbegrunnelse',
                        }}
                        render={({ field, fieldState }) => (
                            <CheckboxGroup
                                className="mt-2"
                                legend="Velg avslagsbegrunnelser"
                                value={field.value || []}
                                size="small"
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                            >
                                {tilgjengeligeAvslagsdager.map((avslagsdag) => (
                                    <Checkbox
                                        key={avslagsdag.kode}
                                        value={avslagsdag.kode}
                                        disabled={valgteDataer.size === 0}
                                    >
                                        {avslagsdag.beskrivelse}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        )}
                    />
                )}
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
