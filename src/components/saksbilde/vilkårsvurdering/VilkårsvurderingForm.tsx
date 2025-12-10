'use client'

import { Fragment, ReactElement, useEffect, useRef } from 'react'
import { Button, Checkbox, CheckboxGroup, HStack, Radio, RadioGroup, Select, Textarea, VStack } from '@navikt/ds-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'

import { useOpprettVilkaarsvurdering } from '@hooks/mutations/useOpprettVilkaarsvurdering'
import { useKodeverk } from '@/hooks/queries/useKodeverk'
import {
    Vilkaarsvurdering as Vilkaarsvurdering,
    VilkaarsvurderingUnderspørsmål as VilkaarsvurderingUnderspørsmål,
    Vurdering,
} from '@schemas/vilkaarsvurdering'
import { Hovedspørsmål } from '@/schemas/saksbehandlergrensesnitt'

interface UnderspørsmålSchema {
    kode: string
    navn?: string | null | undefined
    variant: 'CHECKBOX' | 'RADIO' | 'SELECT'
    alternativer?: AlternativSchema[]
}

interface AlternativSchema {
    kode: string
    navn?: string | null | undefined
    underspørsmål?: UnderspørsmålSchema[]
}

interface VilkårsvurderingFormProps {
    vilkår: Hovedspørsmål
    vurdering?: Vilkaarsvurdering
    onSuccess?: () => void
}

export function VilkårsvurderingForm({ vilkår, vurdering, onSuccess }: VilkårsvurderingFormProps): ReactElement {
    const mutation = useOpprettVilkaarsvurdering()
    const { data: kodeverk = [] } = useKodeverk()
    const errorSummaryRef = useRef<HTMLDivElement>(null)

    const schema = createDynamicSchema(vilkår)
    type FormValues = z.infer<typeof schema>

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {},
    })

    // Flytt fokus til ErrorSummary når det er feil
    useEffect(() => {
        if (Object.keys(errors).length > 0 && errorSummaryRef.current) {
            errorSummaryRef.current.focus()
        }
    }, [errors])

    const finnSpørsmålForAlternativ = (alternativKode: string): string | null => {
        const søkIUnderspørsmål = (spørsmål: UnderspørsmålSchema): string | null => {
            if (spørsmål.alternativer) {
                for (const alt of spørsmål.alternativer) {
                    if (alt.kode === alternativKode) {
                        return spørsmål.kode
                    }
                    if (alt.underspørsmål) {
                        for (const us of alt.underspørsmål) {
                            const found = søkIUnderspørsmål(us)
                            if (found) return found
                        }
                    }
                }
            }
            return null
        }

        for (const spørsmål of vilkår.underspørsmål) {
            const found = søkIUnderspørsmål(spørsmål)
            if (found) return found
        }
        return null
    }

    const finnSpørsmålByKode = (kode: string): UnderspørsmålSchema | null => {
        const søkIUnderspørsmål = (spørsmål: UnderspørsmålSchema): UnderspørsmålSchema | null => {
            if (spørsmål.kode === kode) return spørsmål
            if (spørsmål.alternativer) {
                for (const alt of spørsmål.alternativer) {
                    if (alt.underspørsmål) {
                        for (const us of alt.underspørsmål) {
                            const found = søkIUnderspørsmål(us)
                            if (found) return found
                        }
                    }
                }
            }
            return null
        }

        for (const spørsmål of vilkår.underspørsmål) {
            const found = søkIUnderspørsmål(spørsmål)
            if (found) return found
        }
        return null
    }

    const samleUnderspørsmålKoder = (alternativ: AlternativSchema): string[] => {
        const koder: string[] = []

        const samleFraUnderspørsmål = (underspørsmål: UnderspørsmålSchema[]) => {
            for (const us of underspørsmål) {
                koder.push(us.kode)
                if (us.alternativer) {
                    for (const alt of us.alternativer) {
                        if (alt.underspørsmål) {
                            samleFraUnderspørsmål(alt.underspørsmål)
                        }
                    }
                }
            }
        }

        if (alternativ.underspørsmål) {
            samleFraUnderspørsmål(alternativ.underspørsmål)
        }

        return koder
    }

    useEffect(() => {
        if (vurdering) {
            // Gjenopprett verdier fra eksisterende vurdering
            const values: Record<string, string> = { notat: vurdering.notat ?? '' }

            if (vurdering.underspørsmål && vurdering.underspørsmål.length > 0) {
                for (const usp of vurdering.underspørsmål) {
                    const spørsmålKode = finnSpørsmålForAlternativ(usp.svar)
                    if (spørsmålKode) {
                        const spørsmål = finnSpørsmålByKode(spørsmålKode)
                        if (spørsmål) {
                            if (spørsmål.variant === 'CHECKBOX') {
                                // For checkboxes, samle alle verdier med komma
                                const existing = values[spørsmålKode] || ''
                                values[spørsmålKode] = existing ? `${existing},${usp.svar}` : usp.svar
                            } else {
                                values[spørsmålKode] = usp.svar
                            }
                        }
                    }
                }
            }

            reset(values)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vurdering])

    const fjernUnderspørsmålForAndreAlternativer = (spørsmålKode: string, valgtAlternativKode: string | string[]) => {
        const spørsmål = finnSpørsmålByKode(spørsmålKode)
        if (!spørsmål || !spørsmål.alternativer) return

        const valgteKoder = Array.isArray(valgtAlternativKode) ? valgtAlternativKode : [valgtAlternativKode]
        const alternativerTilFjerning: string[] = []

        for (const alternativ of spørsmål.alternativer) {
            if (!valgteKoder.includes(alternativ.kode)) {
                const koder = samleUnderspørsmålKoder(alternativ)
                alternativerTilFjerning.push(...koder)
            }
        }

        // Nullstill alle underspørsmål for alternativer som ikke er valgt
        alternativerTilFjerning.forEach((kode) => {
            setValue(kode as keyof FormValues, '')
        })
    }

    const onSubmit = async (data: FormValues) => {
        // Bestem samlet vurdering
        const samletVurdering = bestemSamletVurdering(data)

        // Opprett underspørsmål array
        const underspørsmål = opprettUnderspørsmålFraFormData(data)

        await mutation.mutateAsync({
            kode: vilkår.kode,
            vurdering: samletVurdering,
            underspørsmål,
            notat: data.notat || '',
        })

        if (onSuccess) {
            onSuccess()
        }
    }

    const bestemSamletVurdering = (data: FormValues): Vurdering => {
        const values = Object.entries(data)
            .filter(([key]) => key !== 'notat')
            .filter(([, value]) => value && value !== '')

        const harOppfylt = values.some(([, value]) => {
            const verdier = typeof value === 'string' ? value.split(',').filter((v) => v) : []
            return verdier.some((v) => kodeverk.some((vilkår) => vilkår.oppfylt.some((årsak) => årsak.kode === v)))
        })

        const harIkkeOppfylt = values.some(([, value]) => {
            const verdier = typeof value === 'string' ? value.split(',').filter((v) => v) : []
            return verdier.some((v) => kodeverk.some((vilkår) => vilkår.ikkeOppfylt.some((årsak) => årsak.kode === v)))
        })

        if (harIkkeOppfylt) return 'IKKE_OPPFYLT'
        if (harOppfylt) return 'OPPFYLT'
        return 'IKKE_RELEVANT'
    }

    const opprettUnderspørsmålFraFormData = (data: FormValues): VilkaarsvurderingUnderspørsmål[] => {
        const underspørsmål: VilkaarsvurderingUnderspørsmål[] = []

        Object.entries(data).forEach(([spørsmålKode, value]) => {
            if (spørsmålKode === 'notat') return

            if (typeof value === 'string' && value) {
                const verdier = value.split(',').filter((v) => v)
                verdier.forEach((v) => {
                    if (v) {
                        underspørsmål.push({
                            spørsmål: spørsmålKode,
                            svar: v,
                        })
                    }
                })
            }
        })

        return underspørsmål
    }

    const rendreUnderspørsmål = (spørsmål: UnderspørsmålSchema): ReactElement => {
        const error = errors[spørsmål.kode as keyof FormValues]

        switch (spørsmål.variant) {
            case 'CHECKBOX':
                return (
                    <Controller
                        name={spørsmål.kode as keyof FormValues}
                        control={control}
                        render={({ field }) => {
                            const valgteVerdier = field.value
                                ? String(field.value)
                                      .split(',')
                                      .filter((v) => v)
                                : []

                            return (
                                <CheckboxGroup
                                    id={spørsmål.kode}
                                    legend={spørsmål.navn || ''}
                                    value={valgteVerdier}
                                    onChange={(values) => {
                                        field.onChange(values.join(','))
                                        fjernUnderspørsmålForAndreAlternativer(spørsmål.kode, values)
                                    }}
                                    size="small"
                                    error={error?.message}
                                >
                                    <VStack gap="3">
                                        {spørsmål.alternativer?.map((alt) => {
                                            const isSelected = valgteVerdier.includes(alt.kode)
                                            return (
                                                <div key={alt.kode}>
                                                    <Checkbox value={alt.kode} size="small">
                                                        {alt.navn || ''}
                                                    </Checkbox>
                                                    {isSelected &&
                                                        alt.underspørsmål?.map((us) => (
                                                            <div key={us.kode} className="mt-2 ml-6">
                                                                {rendreUnderspørsmål(us)}
                                                            </div>
                                                        ))}
                                                </div>
                                            )
                                        })}
                                    </VStack>
                                </CheckboxGroup>
                            )
                        }}
                    />
                )
            case 'RADIO':
                return (
                    <Controller
                        name={spørsmål.kode as keyof FormValues}
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                id={spørsmål.kode}
                                legend={spørsmål.navn || ''}
                                value={field.value || ''}
                                onChange={(value) => {
                                    field.onChange(value)
                                    fjernUnderspørsmålForAndreAlternativer(spørsmål.kode, value)
                                }}
                                size="small"
                                error={error?.message}
                            >
                                <VStack gap="3">
                                    {spørsmål.alternativer?.map((alt) => {
                                        const isSelected = field.value === alt.kode
                                        return (
                                            <div key={alt.kode}>
                                                <Radio value={alt.kode} size="small">
                                                    {alt.navn || ''}
                                                </Radio>
                                                {isSelected &&
                                                    alt.underspørsmål?.map((us) => (
                                                        <div key={us.kode} className="mt-2 ml-6">
                                                            {rendreUnderspørsmål(us)}
                                                        </div>
                                                    ))}
                                            </div>
                                        )
                                    })}
                                </VStack>
                            </RadioGroup>
                        )}
                    />
                )
            case 'SELECT':
                return (
                    <Controller
                        name={spørsmål.kode as keyof FormValues}
                        control={control}
                        render={({ field }) => {
                            const valgtAlternativ = spørsmål.alternativer?.find((alt) => alt.kode === field.value)

                            return (
                                <>
                                    <Select
                                        id={spørsmål.kode}
                                        label={spørsmål.navn || ''}
                                        value={field.value || ''}
                                        onChange={(e) => {
                                            field.onChange(e.target.value)
                                            fjernUnderspørsmålForAndreAlternativer(spørsmål.kode, e.target.value)
                                        }}
                                        size="small"
                                        className="max-w-96"
                                        error={error?.message}
                                    >
                                        <option value="">Velg...</option>
                                        {spørsmål.alternativer?.map((alt) => (
                                            <option key={alt.kode} value={alt.kode}>
                                                {alt.navn || ''}
                                            </option>
                                        ))}
                                    </Select>
                                    {valgtAlternativ?.underspørsmål?.map((us) => (
                                        <div key={us.kode} className="mt-2 ml-6">
                                            {rendreUnderspørsmål(us)}
                                        </div>
                                    ))}
                                </>
                            )
                        }}
                    />
                )
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack className="max-w-[800px] pb-4 pl-[46px]" gap="6">
                {vilkår.underspørsmål.map((spørsmål) => (
                    <Fragment key={spørsmål.kode}>{rendreUnderspørsmål(spørsmål)}</Fragment>
                ))}

                <Controller
                    name="notat"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            label="Utvidet begrunnelse"
                            description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                            value={field.value || ''}
                            onChange={field.onChange}
                            size="small"
                            minRows={3}
                        />
                    )}
                />

                <HStack gap="4">
                    <Button variant="primary" size="small" type="submit" loading={mutation.isPending}>
                        Lagre vurdering
                    </Button>
                </HStack>
            </VStack>
        </form>
    )
}

// Dynamisk schema basert på vilkårstruktur
function createDynamicSchema(vilkår: Hovedspørsmål) {
    // Bygger et objekt med alle mulige spørsmål
    const spørsmålFields: Record<string, z.ZodString | z.ZodOptional<z.ZodString>> = {}

    const samleSpørsmålKoder = (spørsmål: UnderspørsmålSchema, isTopLevel: boolean = false) => {
        // Registrer dette spørsmålet
        // Top level spørsmål er påkrevd, men ikke CHECKBOX (som er valgfri)
        if (isTopLevel && spørsmål.variant !== 'CHECKBOX') {
            spørsmålFields[spørsmål.kode] = z
                .string({
                    message: 'Du må velge et alternativ',
                })
                .min(1, 'Du må velge et alternativ')
        } else {
            spørsmålFields[spørsmål.kode] = z.string().optional()
        }

        // Gå gjennom alternativer og deres underspørsmål
        if (spørsmål.alternativer) {
            for (const alt of spørsmål.alternativer) {
                if (alt.underspørsmål) {
                    for (const nestedSpørsmål of alt.underspørsmål) {
                        samleSpørsmålKoder(nestedSpørsmål, false)
                    }
                }
            }
        }
    }

    // Samle alle spørsmål - første nivå er påkrevd
    for (const spørsmål of vilkår.underspørsmål) {
        samleSpørsmålKoder(spørsmål, true)
    }

    return z
        .object({
            ...spørsmålFields,
            notat: z.string().optional(),
        })
        .superRefine((data, ctx) => {
            // Custom validering for å sjekke at underspørsmål er besvart
            const validerUnderspørsmål = (spørsmål: UnderspørsmålSchema, path: string[] = []) => {
                if (spørsmål.variant === 'RADIO' || spørsmål.variant === 'SELECT') {
                    const valgtVerdi = (data as Record<string, string | undefined>)[spørsmål.kode]
                    if (valgtVerdi) {
                        const valgtAlternativ = spørsmål.alternativer?.find((alt) => alt.kode === valgtVerdi)
                        if (valgtAlternativ?.underspørsmål) {
                            for (const nestedSpørsmål of valgtAlternativ.underspørsmål) {
                                const nestedVerdi = (data as Record<string, string | undefined>)[nestedSpørsmål.kode]
                                if (!nestedVerdi || nestedVerdi.trim() === '') {
                                    ctx.addIssue({
                                        code: z.ZodIssueCode.custom,
                                        path: [nestedSpørsmål.kode],
                                        message: 'Dette feltet er påkrevd',
                                    })
                                } else {
                                    // Rekursivt valider nestede spørsmål
                                    validerUnderspørsmål(nestedSpørsmål, [...path, nestedSpørsmål.kode])
                                }
                            }
                        }
                    }
                } else if (spørsmål.variant === 'CHECKBOX') {
                    const verdi = (data as Record<string, string | undefined>)[spørsmål.kode]
                    const valgteVerdier = verdi?.split(',').filter((v: string) => v) || []
                    if (valgteVerdier.length > 0) {
                        for (const valgtVerdi of valgteVerdier) {
                            const valgtAlternativ = spørsmål.alternativer?.find((alt) => alt.kode === valgtVerdi)
                            if (valgtAlternativ?.underspørsmål) {
                                for (const nestedSpørsmål of valgtAlternativ.underspørsmål) {
                                    const nestedVerdi = (data as Record<string, string | undefined>)[
                                        nestedSpørsmål.kode
                                    ]
                                    if (!nestedVerdi || nestedVerdi.trim() === '') {
                                        ctx.addIssue({
                                            code: z.ZodIssueCode.custom,
                                            path: [nestedSpørsmål.kode],
                                            message: 'Dette feltet er påkrevd',
                                        })
                                    } else {
                                        validerUnderspørsmål(nestedSpørsmål, [...path, nestedSpørsmål.kode])
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Valider alle hovedspørsmål
            for (const spørsmål of vilkår.underspørsmål) {
                validerUnderspørsmål(spørsmål)
            }
        })
}
