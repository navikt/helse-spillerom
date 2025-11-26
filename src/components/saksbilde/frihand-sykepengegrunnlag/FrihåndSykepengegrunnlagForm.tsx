'use client'

import React, { ReactElement, useMemo } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Button,
    Chips,
    ErrorSummary,
    Heading,
    Radio,
    RadioGroup,
    Textarea,
    UNSAFE_Combobox as Combobox,
    VStack,
} from '@navikt/ds-react'
import { ErrorSummaryItem } from '@navikt/ds-react/ErrorSummary'
import { z } from 'zod/v4'

import { useBeregningsregler } from '@hooks/queries/useBeregningsregler'
import { useOpprettSykepengegrunnlag } from '@hooks/mutations/useOpprettSykepengegrunnlag'
import { OpprettSykepengegrunnlagRequest } from '@schemas/sykepengegrunnlag'
import { PengerField } from '@components/saksbilde/sykepengegrunnlag/form/PengerField'
import { kronerTilØrer } from '@schemas/øreUtils'

type ÅrsakTilFrihånd = 'MANGLER_STØTTE_I_SPILLEROM' | 'OVERTATT_SAK_FRA_SPEIL' | 'OVERTATT_SAK_FRA_INFOTRYGD'

const frihåndSykepengegrunnlagFormSchema = z
    .object({
        årsakTilFrihånd: z
            .enum(['MANGLER_STØTTE_I_SPILLEROM', 'OVERTATT_SAK_FRA_SPEIL', 'OVERTATT_SAK_FRA_INFOTRYGD'])
            .or(z.literal('')),
        beregningsgrunnlag: z.number().optional(),
        begrunnelse: z.string(),
        valgteÅrsaker: z.array(z.object({ kode: z.string(), beskrivelse: z.string() })),
    })
    .superRefine((values, ctx) => {
        if (!values.beregningsgrunnlag || values.beregningsgrunnlag <= 0) {
            ctx.addIssue({
                code: 'custom',
                path: ['beregningsgrunnlag'],
                message: 'Beregningsgrunnlag er påkrevd og må være større enn 0',
            })
        }
        if (!values.begrunnelse || values.begrunnelse.trim().length === 0) {
            ctx.addIssue({
                code: 'custom',
                path: ['begrunnelse'],
                message: 'Begrunnelse er påkrevd',
            })
        }
        if (values.årsakTilFrihånd === 'MANGLER_STØTTE_I_SPILLEROM' && values.valgteÅrsaker.length === 0) {
            ctx.addIssue({
                code: 'custom',
                path: ['valgteÅrsaker'],
                message: 'Minst én beregningskode må velges når årsak er "Mangler støtte i spillerom"',
            })
        }
    })

type FrihåndSykepengegrunnlagFormData = z.infer<typeof frihåndSykepengegrunnlagFormSchema>

export function FrihåndSykepengegrunnlagForm(): ReactElement {
    const mutation = useOpprettSykepengegrunnlag()
    const { data: beregningsregler } = useBeregningsregler()

    const form = useForm<FrihåndSykepengegrunnlagFormData>({
        resolver: zodResolver(frihåndSykepengegrunnlagFormSchema),
        defaultValues: {
            årsakTilFrihånd: '',
            beregningsgrunnlag: undefined,
            begrunnelse: '',
            valgteÅrsaker: [],
        },
        shouldFocusError: false,
    })

    const årsakTilFrihånd = form.watch('årsakTilFrihånd')
    const valgteÅrsaker = form.watch('valgteÅrsaker')

    // Filtrer beregningsregler som har SYKEPENGEGRUNNLAG i kodeverdien
    const sykepengegrunnlagKoder = useMemo(() => {
        if (!beregningsregler) return []
        const unikeKoder = new Map<string, { kode: string; beskrivelse: string }>()
        beregningsregler
            .filter((regel) => regel.kode.includes('SYKEPENGEGRUNNLAG'))
            .forEach((regel) => {
                if (!unikeKoder.has(regel.kode)) {
                    unikeKoder.set(regel.kode, { kode: regel.kode, beskrivelse: regel.beskrivelse })
                }
            })
        return Array.from(unikeKoder.values()).map((regel) => ({
            value: regel.kode,
            label: regel.beskrivelse,
            beskrivelse: regel.beskrivelse,
        }))
    }, [beregningsregler])

    const visÅrsakerCombobox = årsakTilFrihånd === 'MANGLER_STØTTE_I_SPILLEROM'

    const handleLeggTilÅrsak = (kode: string) => {
        const regel = sykepengegrunnlagKoder.find((r) => r.value === kode)
        if (regel && !valgteÅrsaker.some((årsak) => årsak.kode === kode)) {
            form.setValue('valgteÅrsaker', [...valgteÅrsaker, { kode, beskrivelse: regel.beskrivelse }])
        }
    }

    const handleFjernÅrsak = (kode: string) => {
        form.setValue(
            'valgteÅrsaker',
            valgteÅrsaker.filter((årsak) => årsak.kode !== kode),
        )
    }

    async function onSubmit(data: FrihåndSykepengegrunnlagFormData) {
        if (!data.beregningsgrunnlag) {
            return // Skal ikke skje pga validering, men TypeScript trenger dette
        }

        const request: OpprettSykepengegrunnlagRequest = {
            beregningsgrunnlag: kronerTilØrer(data.beregningsgrunnlag),
            begrunnelse: data.begrunnelse,
            beregningskoder: data.valgteÅrsaker.map((årsak) => årsak.kode),
        }

        await mutation.mutateAsync(request)
    }

    return (
        <FormProvider {...form}>
            <VStack gap="6" className="p-8">
                <Heading size="small" level="2" spacing>
                    Opprett frihånd sykepengegrunnlag
                </Heading>

                <VStack as="form" role="form" gap="6" onSubmit={form.handleSubmit(onSubmit)}>
                    <Controller
                        control={form.control}
                        name="årsakTilFrihånd"
                        render={({ field, fieldState }) => (
                            <RadioGroup
                                legend="Årsak til frihånd"
                                value={field.value || ''}
                                onChange={(value) => {
                                    field.onChange((value || '') as ÅrsakTilFrihånd | '')
                                    // Nullstill valgte årsaker og begrunnelse når årsak endres
                                    if (value !== 'MANGLER_STØTTE_I_SPILLEROM') {
                                        form.setValue('valgteÅrsaker', [])
                                        form.setValue('begrunnelse', '')
                                    }
                                }}
                                error={fieldState.error?.message}
                            >
                                <Radio value="MANGLER_STØTTE_I_SPILLEROM">Mangler støtte i spillerom</Radio>
                                <Radio value="OVERTATT_SAK_FRA_SPEIL">Overtatt sak fra speil</Radio>
                                <Radio value="OVERTATT_SAK_FRA_INFOTRYGD">Overtatt sak fra infotrygd</Radio>
                            </RadioGroup>
                        )}
                    />

                    {visÅrsakerCombobox && (
                        <VStack gap="4">
                            <Combobox
                                label="Beregningskoder"
                                options={sykepengegrunnlagKoder}
                                onToggleSelected={(option) => {
                                    handleLeggTilÅrsak(option)
                                }}
                            />
                            {valgteÅrsaker.length > 0 && (
                                <VStack gap="2">
                                    <Chips>
                                        {valgteÅrsaker.map((årsak) => (
                                            <Chips.Removable
                                                key={årsak.kode}
                                                onDelete={() => handleFjernÅrsak(årsak.kode)}
                                            >
                                                {årsak.beskrivelse}
                                            </Chips.Removable>
                                        ))}
                                    </Chips>
                                </VStack>
                            )}
                        </VStack>
                    )}

                    <PengerField
                        name="beregningsgrunnlag"
                        label="Beregningsgrunnlag"
                        readOnly={false}
                        className="w-[200px]"
                    />

                    <Controller
                        control={form.control}
                        name="begrunnelse"
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                label="Begrunnelse til beslutter"
                                value={field.value ?? ''}
                                minRows={6}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

                    {Object.keys(form.formState.errors).length > 0 && (
                        <ErrorSummary>
                            {form.formState.errors.beregningsgrunnlag && (
                                <ErrorSummaryItem href="#beregningsgrunnlag">
                                    {form.formState.errors.beregningsgrunnlag.message}
                                </ErrorSummaryItem>
                            )}
                            {form.formState.errors.begrunnelse && (
                                <ErrorSummaryItem href="#begrunnelse">
                                    {form.formState.errors.begrunnelse.message}
                                </ErrorSummaryItem>
                            )}
                            {form.formState.errors.valgteÅrsaker && (
                                <ErrorSummaryItem href="#valgteÅrsaker">
                                    {form.formState.errors.valgteÅrsaker.message}
                                </ErrorSummaryItem>
                            )}
                        </ErrorSummary>
                    )}

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            variant="primary"
                            loading={form.formState.isSubmitting || mutation.isPending}
                        >
                            Opprett
                        </Button>
                    </div>
                </VStack>
            </VStack>
        </FormProvider>
    )
}
