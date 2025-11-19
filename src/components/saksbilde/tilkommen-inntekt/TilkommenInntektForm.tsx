'use client'

import React, { ReactElement, useMemo } from 'react'
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, ErrorSummary, HStack, Select, Textarea, TextField, VStack } from '@navikt/ds-react'
import { PadlockLockedIcon, XMarkIcon } from '@navikt/aksel-icons'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { ErrorSummaryItem } from '@navikt/ds-react/ErrorSummary'

import { useOpprettTilkommenInntekt } from '@hooks/mutations/useOpprettTilkommenInntekt'
import {
    OpprettTilkommenInntektRequest,
    opprettTilkommenInntektRequestSchema,
    TilkommenInntektYrkesaktivitetType,
} from '@schemas/tilkommenInntekt'
import { DateField } from '@components/saksbilde/sykepengegrunnlag/form/DateField'
import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { useOrganisasjonsnavn } from '@hooks/queries/useOrganisasjonsnavn'
import { Organisasjonsnavn } from '@components/organisasjon/Organisasjonsnavn'
import { formaterBeløpKroner } from '@schemas/øreUtils'
import { useAktivSaksbehandlingsperiode } from '@hooks/queries/useAktivSaksbehandlingsperiode'

const yrkesaktivitetTypeLabels: Record<TilkommenInntektYrkesaktivitetType, string> = {
    VIRKSOMHET: 'Virksomhet',
    PRIVATPERSON: 'Privatperson',
    NÆRINGSDRIVENDE: 'Næringsdrivende',
}

export function TilkommenInntektForm(): ReactElement {
    const router = useRouter()
    const mutation = useOpprettTilkommenInntekt()
    const aktivPeriode = useAktivSaksbehandlingsperiode()

    // Dynamisk valideringsschema
    const form = useForm({
        resolver: zodResolver(
            opprettTilkommenInntektRequestSchema.superRefine((values, ctx) => {
                if (aktivPeriode) {
                    const fomBehandling = dayjs(aktivPeriode.fom)
                    const tomBehandling = dayjs(aktivPeriode.tom)
                    const fom = dayjs(values.fom)
                    const tom = dayjs(values.tom)
                    if (fom.isBefore(fomBehandling) || fom.isAfter(tomBehandling)) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['fom'],
                            message: `Fra-dato må være mellom ${fomBehandling.format('DD.MM.YYYY')} og ${tomBehandling.format('DD.MM.YYYY')}`,
                        })
                    }
                    if (tom.isBefore(fomBehandling) || tom.isAfter(tomBehandling)) {
                        ctx.addIssue({
                            code: 'custom',
                            path: ['tom'],
                            message: `Til-dato må være mellom ${fomBehandling.format('DD.MM.YYYY')} og ${tomBehandling.format('DD.MM.YYYY')}`,
                        })
                    }
                }
            }),
        ),
        defaultValues: {
            ident: '',
            yrkesaktivitetType: 'VIRKSOMHET' as const,
            fom: '',
            tom: '',
            inntektForPerioden: undefined,
            notatTilBeslutter: '',
            ekskluderteDager: [],
        },
        shouldFocusError: false,
    })

    const ident = useWatch({ control: form.control, name: 'ident' })
    const fom = useWatch({ control: form.control, name: 'fom' })
    const tom = useWatch({ control: form.control, name: 'tom' })
    const inntektForPerioden = useWatch({ control: form.control, name: 'inntektForPerioden' })

    const harGyldigOrgnummer = ident && ident.length === 9
    const { data: organisasjonsnavn } = useOrganisasjonsnavn(harGyldigOrgnummer ? ident : '')

    // Beregn antall dager mellom fom og tom (inkludert begge ender)
    const antallDager = useMemo(() => {
        if (!fom || !tom) return 0
        const fomDate = dayjs(fom)
        const tomDate = dayjs(tom)
        if (!fomDate.isValid() || !tomDate.isValid()) return 0
        return tomDate.diff(fomDate, 'day') + 1
    }, [fom, tom])

    // Beregn inntekt per dag
    const inntektPerDag = useMemo(() => {
        if (!inntektForPerioden || antallDager === 0) return undefined
        return inntektForPerioden / antallDager
    }, [inntektForPerioden, antallDager])

    async function onSubmit(data: OpprettTilkommenInntektRequest) {
        await mutation.mutateAsync(data)
    }

    const handleAvbryt = () => {
        router.back()
    }

    return (
        <FormProvider {...form}>
            <VStack gap="6" className="p-8">
                <HStack justify="space-between" align="center">
                    <h2 className="text-xl font-semibold">Tilkommen inntekt</h2>
                    <Button variant="tertiary" size="small" icon={<XMarkIcon aria-hidden />} onClick={handleAvbryt}>
                        Avbryt
                    </Button>
                </HStack>

                <VStack as="form" role="form" gap="6" onSubmit={form.handleSubmit(onSubmit)}>
                    <HStack gap="4" align="start">
                        <Controller
                            control={form.control}
                            name="ident"
                            render={({ field, fieldState }) => (
                                <VStack gap="2">
                                    <TextField
                                        {...field}
                                        id="ident"
                                        label="Organisasjonsnummer"
                                        size="small"
                                        className="w-[200px]"
                                        error={fieldState.error?.message != undefined}
                                    />
                                    {harGyldigOrgnummer && organisasjonsnavn && (
                                        <div className="text-sm text-ax-text-neutral-subtle">
                                            <Organisasjonsnavn orgnummer={ident} />
                                        </div>
                                    )}
                                </VStack>
                            )}
                        />

                        <Controller
                            control={form.control}
                            name="yrkesaktivitetType"
                            render={({ field, fieldState }) => (
                                <Select
                                    {...field}
                                    id="yrkesaktivitetType"
                                    label="Yrkesaktivitetstype"
                                    size="small"
                                    className="w-[200px]"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={fieldState.error?.message != undefined}
                                >
                                    {Object.entries(yrkesaktivitetTypeLabels).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        />
                    </HStack>

                    <HStack gap="4">
                        <DateField
                            name="fom"
                            label="Periode f.o.m"
                            fromDate={aktivPeriode ? dayjs(aktivPeriode.fom).toDate() : undefined}
                            toDate={aktivPeriode ? dayjs(aktivPeriode.tom).toDate() : undefined}
                        />
                        <DateField
                            name="tom"
                            label="Periode t.o.m"
                            fromDate={aktivPeriode ? dayjs(aktivPeriode.fom).toDate() : undefined}
                            toDate={aktivPeriode ? dayjs(aktivPeriode.tom).toDate() : undefined}
                        />
                    </HStack>

                    <HStack gap="4">
                        <PengerField
                            name="inntektForPerioden"
                            label="Inntekt for perioden"
                            readOnly={false}
                            className="w-[200px]"
                        />
                        <div className="relative w-[200px]">
                            <TextField
                                id="inntektPerDag"
                                label="Inntekt per dag"
                                value={
                                    inntektPerDag !== undefined ? formaterBeløpKroner(inntektPerDag, 2, 'decimal') : ''
                                }
                                readOnly
                                size="small"
                                className="[&_input]:text-right"
                            />
                            <div className="absolute top-8 right-2">
                                <PadlockLockedIcon aria-hidden className="text-ax-text-neutral-subtle" />
                            </div>
                        </div>
                    </HStack>

                    <Controller
                        control={form.control}
                        name="notatTilBeslutter"
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                id="notatTilBeslutter"
                                value={field.value ?? ''}
                                className="w-full"
                                size="small"
                                label="Notat til beslutter"
                                description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                                minRows={6}
                                error={fieldState.error?.message != undefined}
                            />
                        )}
                    />

                    {Object.keys(form.formState.errors).length > 0 && (
                        <ErrorSummary>
                            {form.formState.errors.ident && (
                                <ErrorSummaryItem href="#ident">{form.formState.errors.ident.message}</ErrorSummaryItem>
                            )}
                            {form.formState.errors.yrkesaktivitetType && (
                                <ErrorSummaryItem href="#yrkesaktivitetType">
                                    {form.formState.errors.yrkesaktivitetType.message}
                                </ErrorSummaryItem>
                            )}
                            {form.formState.errors.fom && (
                                <ErrorSummaryItem href="#fom">{form.formState.errors.fom.message}</ErrorSummaryItem>
                            )}
                            {form.formState.errors.tom && (
                                <ErrorSummaryItem href="#tom">{form.formState.errors.tom.message}</ErrorSummaryItem>
                            )}
                            {form.formState.errors.inntektForPerioden && (
                                <ErrorSummaryItem href="#inntektForPerioden">
                                    {form.formState.errors.inntektForPerioden.message}
                                </ErrorSummaryItem>
                            )}
                            {form.formState.errors.notatTilBeslutter && (
                                <ErrorSummaryItem href="#notatTilBeslutter">
                                    {form.formState.errors.notatTilBeslutter.message}
                                </ErrorSummaryItem>
                            )}
                        </ErrorSummary>
                    )}

                    <HStack gap="2" align="center" className="h-8" wrap={false}>
                        <Button type="submit" size="small" loading={form.formState.isSubmitting || mutation.isPending}>
                            Lagre
                        </Button>
                        <Button
                            type="button"
                            size="small"
                            variant="secondary"
                            onClick={handleAvbryt}
                            disabled={form.formState.isSubmitting || mutation.isPending}
                        >
                            Avbryt
                        </Button>
                    </HStack>
                </VStack>
            </VStack>
        </FormProvider>
    )
}
