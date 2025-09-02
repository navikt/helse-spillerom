'use client'

import { Fragment, ReactElement, useEffect, useState } from 'react'
import { Button, Checkbox, CheckboxGroup, HStack, Radio, RadioGroup, Select, Textarea, VStack } from '@navikt/ds-react'

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
    const [selectedValues, setSelectedValues] = useState<Record<string, string | string[]>>({})
    const [notat, setNotat] = useState<string>(vurdering?.notat ?? '')
    const mutation = useOpprettVilkaarsvurdering()
    const { data: kodeverk = [] } = useKodeverk()

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

    const fjernUnderspørsmålForAndreAlternativer = (
        spørsmålKode: string,
        valgtAlternativKode: string,
    ): Record<string, string | string[]> => {
        const spørsmål = finnSpørsmålByKode(spørsmålKode)
        if (!spørsmål || !spørsmål.alternativer) {
            return selectedValues
        }

        const alternativerTilFjerning: string[] = []

        // Samle alle underspørsmål-koder fra andre alternativer
        for (const alternativ of spørsmål.alternativer) {
            if (alternativ.kode !== valgtAlternativKode) {
                const koder = samleUnderspørsmålKoder(alternativ)
                alternativerTilFjerning.push(...koder)
            }
        }

        // Fjern alle disse koder fra selectedValues
        const nyeValgteVerdier = { ...selectedValues }
        alternativerTilFjerning.forEach((kode) => {
            delete nyeValgteVerdier[kode]
        })

        return nyeValgteVerdier
    }

    const gjenopprettValgteVerdierFraUnderspørsmål = (
        underspørsmål: VilkaarsvurderingUnderspørsmål[],
    ): Record<string, string | string[]> => {
        const gjenopprettedeVerdier: Record<string, string | string[]> = {}

        // For each underspørsmål, find which spørsmål it belongs to and set the value
        for (const usp of underspørsmål) {
            const spørsmålKode = finnSpørsmålForAlternativ(usp.svar)
            if (spørsmålKode) {
                const spørsmål = finnSpørsmålByKode(spørsmålKode)
                if (spørsmål) {
                    if (spørsmål.variant === 'CHECKBOX') {
                        const existing = (gjenopprettedeVerdier[spørsmålKode] as string[]) || []
                        gjenopprettedeVerdier[spørsmålKode] = [...existing, usp.svar]
                    } else {
                        gjenopprettedeVerdier[spørsmålKode] = usp.svar
                    }
                }
            }
        }

        return gjenopprettedeVerdier
    }

    useEffect(() => {
        if (vurdering) {
            // Initialize form with existing values if available
            setNotat(vurdering.notat ?? '')

            // Reconstruct selectedValues based on existing underspørsmål
            if (vurdering.underspørsmål && vurdering.underspørsmål.length > 0) {
                const gjenopprettedeVerdier = gjenopprettValgteVerdierFraUnderspørsmål(vurdering.underspørsmål)
                setSelectedValues(gjenopprettedeVerdier)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vurdering])

    const håndterRadioEndring = (kode: string, value: string) => {
        setSelectedValues(() => {
            const nyeVerdier = fjernUnderspørsmålForAndreAlternativer(kode, value)
            return {
                ...nyeVerdier,
                [kode]: value,
            }
        })
    }

    const håndterCheckboxEndring = (kode: string, values: string[]) => {
        setSelectedValues(() => {
            // For checkbox grupper, fjern underspørsmål for alternativer som ikke lenger er valgt
            const spørsmål = finnSpørsmålByKode(kode)
            if (!spørsmål || !spørsmål.alternativer) {
                return {
                    ...selectedValues,
                    [kode]: values,
                }
            }

            const alternativerTilFjerning: string[] = []

            // Samle alle underspørsmål-koder fra alternativer som ikke lenger er valgt
            for (const alternativ of spørsmål.alternativer) {
                if (!values.includes(alternativ.kode)) {
                    const koder = samleUnderspørsmålKoder(alternativ)
                    alternativerTilFjerning.push(...koder)
                }
            }

            // Fjern alle disse koder fra selectedValues
            const nyeValgteVerdier = { ...selectedValues }
            alternativerTilFjerning.forEach((kodeTilFjerning) => {
                delete nyeValgteVerdier[kodeTilFjerning]
            })

            return {
                ...nyeValgteVerdier,
                [kode]: values,
            }
        })
    }

    const håndterSelectEndring = (kode: string, value: string) => {
        setSelectedValues(() => {
            const nyeVerdier = fjernUnderspørsmålForAndreAlternativer(kode, value)
            return {
                ...nyeVerdier,
                [kode]: value,
            }
        })
    }

    const håndterInnsending = async () => {
        // Determine the overall assessment based on selected values
        const samletVurdering = bestemSamletVurdering()

        // Create underspørsmål array from selected values
        const underspørsmål = opprettUnderspørsmålFraValgteVerdier()

        await mutation.mutateAsync({
            kode: vilkår.kode,
            vurdering: samletVurdering,
            underspørsmål,
            notat,
        })

        if (onSuccess) {
            onSuccess()
        }
    }

    const bestemSamletVurdering = (): Vurdering => {
        // Logic to determine overall assessment based on selected values
        // IKKE_OPPFYLT takes precedence over OPPFYLT - if any condition is not met, the entire assessment fails

        // Looper gjennom alle oppfylt og ikkeOppfylt lister i hele kodeverket
        const harOppfylt = Object.values(selectedValues).some((value) => {
            if (typeof value === 'string') {
                return kodeverk.some((vilkår) => vilkår.oppfylt.some((årsak) => årsak.kode === value))
            }
            if (Array.isArray(value)) {
                return value.some((v) => kodeverk.some((vilkår) => vilkår.oppfylt.some((årsak) => årsak.kode === v)))
            }
            return false
        })

        const harIkkeOppfylt = Object.values(selectedValues).some((value) => {
            if (typeof value === 'string') {
                return kodeverk.some((vilkår) => vilkår.ikkeOppfylt.some((årsak) => årsak.kode === value))
            }
            if (Array.isArray(value)) {
                return value.some((v) =>
                    kodeverk.some((vilkår) => vilkår.ikkeOppfylt.some((årsak) => årsak.kode === v)),
                )
            }
            return false
        })

        // IKKE_OPPFYLT takes precedence - if anything is not fulfilled, the entire assessment fails
        if (harIkkeOppfylt) return 'IKKE_OPPFYLT'
        if (harOppfylt) return 'OPPFYLT'
        return 'IKKE_RELEVANT'
    }

    const opprettUnderspørsmålFraValgteVerdier = (): VilkaarsvurderingUnderspørsmål[] => {
        const underspørsmål: VilkaarsvurderingUnderspørsmål[] = []

        // Convert selectedValues to underspørsmål format
        Object.entries(selectedValues).forEach(([spørsmålKode, value]) => {
            if (typeof value === 'string' && value) {
                underspørsmål.push({
                    spørsmål: spørsmålKode,
                    svar: value,
                })
            } else if (Array.isArray(value)) {
                value.forEach((v) => {
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
        switch (spørsmål.variant) {
            case 'CHECKBOX':
                return (
                    <CheckboxGroup
                        legend={spørsmål.navn || ''}
                        value={(selectedValues[spørsmål.kode] as string[]) || []}
                        onChange={(values) => håndterCheckboxEndring(spørsmål.kode, values)}
                        size="small"
                    >
                        <VStack gap="3">
                            {spørsmål.alternativer?.map((alt) => {
                                const isSelected = ((selectedValues[spørsmål.kode] as string[]) || []).includes(
                                    alt.kode,
                                )
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
            case 'RADIO':
                return (
                    <RadioGroup
                        legend={spørsmål.navn || ''}
                        value={(selectedValues[spørsmål.kode] as string) || ''}
                        onChange={(value) => håndterRadioEndring(spørsmål.kode, value)}
                        size="small"
                    >
                        <VStack gap="3">
                            {spørsmål.alternativer?.map((alt) => {
                                const isSelected = selectedValues[spørsmål.kode] === alt.kode
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
                )
            case 'SELECT':
                return (
                    <Select
                        label={spørsmål.navn || ''}
                        value={(selectedValues[spørsmål.kode] as string) || ''}
                        onChange={(e) => håndterSelectEndring(spørsmål.kode, e.target.value)}
                        size="small"
                        className="max-w-96"
                    >
                        <option value="">Velg...</option>
                        {spørsmål.alternativer?.map((alt) => (
                            <option key={alt.kode} value={alt.kode}>
                                {alt.navn || ''}
                            </option>
                        ))}
                    </Select>
                )
        }
    }

    return (
        <VStack className="max-w-[800px] pb-4 pl-[46px]" gap="6">
            {vilkår.underspørsmål.map((spørsmål) => (
                <Fragment key={spørsmål.kode}>{rendreUnderspørsmål(spørsmål)}</Fragment>
            ))}

            <Textarea
                label="Utvidet begrunnelse"
                description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                value={notat}
                onChange={(e) => setNotat(e.target.value)}
                size="small"
                minRows={3}
            />

            <HStack gap="4">
                <Button
                    variant="primary"
                    size="small"
                    type="button"
                    loading={mutation.isPending}
                    onClick={håndterInnsending}
                >
                    Lagre vurdering
                </Button>
            </HStack>
        </VStack>
    )
}
