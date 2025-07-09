'use client'

import { ReactElement, useState, useEffect, Fragment } from 'react'
import { Button, Checkbox, CheckboxGroup, HStack, Radio, RadioGroup, Select, Textarea, VStack } from '@navikt/ds-react'

import { useOpprettVilkaarsvurderingV2 } from '@hooks/mutations/useOpprettVilkaarsvurderingV2'
import { Vilkår } from '@schemas/kodeverkV2'
import { VilkaarsvurderingV2, Vurdering, VilkaarsvurderingV2Arsak } from '@schemas/vilkaarsvurdering'

interface UnderspørsmålSchema {
    kode: string
    navn: string
    variant: 'CHECKBOX' | 'RADIO' | 'SELECT'
    alternativer?: AlternativSchema[]
}

interface AlternativSchema {
    kode: string
    navn: string
    oppfylt?: 'OPPFYLT' | 'IKKE_OPPFYLT' | 'N/A'
    vilkårshjemmel?: unknown
    underspørsmål?: UnderspørsmålSchema[]
}

interface VilkårsvurderingV2FormProps {
    vilkår: Vilkår
    vurdering?: VilkaarsvurderingV2
    onSuccess?: () => void
}

export function VilkårsvurderingV2Form({ vilkår, vurdering, onSuccess }: VilkårsvurderingV2FormProps): ReactElement {
    const [selectedValues, setSelectedValues] = useState<Record<string, string | string[]>>({})
    const [notat, setNotat] = useState<string>(vurdering?.notat ?? '')
    const mutation = useOpprettVilkaarsvurderingV2()

    const findSpørsmålForAlternativ = (alternativKode: string): string | null => {
        const searchInUnderspørsmål = (spørsmål: UnderspørsmålSchema): string | null => {
            if (spørsmål.alternativer) {
                for (const alt of spørsmål.alternativer) {
                    if (alt.kode === alternativKode) {
                        return spørsmål.kode
                    }
                    if (alt.underspørsmål) {
                        for (const us of alt.underspørsmål) {
                            const found = searchInUnderspørsmål(us)
                            if (found) return found
                        }
                    }
                }
            }
            return null
        }

        for (const spørsmål of vilkår.underspørsmål) {
            const found = searchInUnderspørsmål(spørsmål)
            if (found) return found
        }
        return null
    }

    const findSpørsmålByKode = (kode: string): UnderspørsmålSchema | null => {
        const searchInUnderspørsmål = (spørsmål: UnderspørsmålSchema): UnderspørsmålSchema | null => {
            if (spørsmål.kode === kode) return spørsmål
            if (spørsmål.alternativer) {
                for (const alt of spørsmål.alternativer) {
                    if (alt.underspørsmål) {
                        for (const us of alt.underspørsmål) {
                            const found = searchInUnderspørsmål(us)
                            if (found) return found
                        }
                    }
                }
            }
            return null
        }

        for (const spørsmål of vilkår.underspørsmål) {
            const found = searchInUnderspørsmål(spørsmål)
            if (found) return found
        }
        return null
    }

    const reconstructSelectedValuesFromArsaker = (
        årsaker: VilkaarsvurderingV2Arsak[],
    ): Record<string, string | string[]> => {
        const reconstructedValues: Record<string, string | string[]> = {}

        // For each årsak, find which spørsmål it belongs to and set the value
        for (const årsak of årsaker) {
            const spørsmålKode = findSpørsmålForAlternativ(årsak.vurdering)
            if (spørsmålKode) {
                const spørsmål = findSpørsmålByKode(spørsmålKode)
                if (spørsmål) {
                    if (spørsmål.variant === 'CHECKBOX') {
                        const existing = (reconstructedValues[spørsmålKode] as string[]) || []
                        reconstructedValues[spørsmålKode] = [...existing, årsak.vurdering]
                    } else {
                        reconstructedValues[spørsmålKode] = årsak.vurdering
                    }
                }
            }
        }

        return reconstructedValues
    }

    useEffect(() => {
        if (vurdering) {
            // Initialize form with existing values if available
            setNotat(vurdering.notat ?? '')

            // Reconstruct selectedValues based on existing årsaker
            if (vurdering.årsaker && vurdering.årsaker.length > 0) {
                const reconstructedValues = reconstructSelectedValuesFromArsaker(vurdering.årsaker)
                setSelectedValues(reconstructedValues)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vurdering])

    const handleRadioChange = (kode: string, value: string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [kode]: value,
        }))
    }

    const handleCheckboxChange = (kode: string, values: string[]) => {
        setSelectedValues((prev) => ({
            ...prev,
            [kode]: values,
        }))
    }

    const handleSelectChange = (kode: string, value: string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [kode]: value,
        }))
    }

    const handleSubmit = async () => {
        // Determine the overall assessment based on selected values
        const overallAssessment = determineOverallAssessment()

        // Create årsaker array from selected values
        const årsaker = createArsakerFromSelectedValues()

        await mutation.mutateAsync({
            kode: vilkår.vilkårskode,
            vurdering: overallAssessment,
            årsaker,
            notat,
        })

        if (onSuccess) {
            onSuccess()
        }
    }

    const determineOverallAssessment = (): Vurdering => {
        // Logic to determine overall assessment based on selected values
        // This is a simplified version - you may need to adjust based on your business logic

        // Check if any selected alternative has an oppfylt status
        const hasOppfylt = Object.values(selectedValues).some((value) => {
            if (typeof value === 'string') {
                return findAlternativeByKode(value)?.oppfylt === 'OPPFYLT'
            }
            if (Array.isArray(value)) {
                return value.some((v) => findAlternativeByKode(v)?.oppfylt === 'OPPFYLT')
            }
            return false
        })

        const hasIkkeOppfylt = Object.values(selectedValues).some((value) => {
            if (typeof value === 'string') {
                return findAlternativeByKode(value)?.oppfylt === 'IKKE_OPPFYLT'
            }
            if (Array.isArray(value)) {
                return value.some((v) => findAlternativeByKode(v)?.oppfylt === 'IKKE_OPPFYLT')
            }
            return false
        })

        if (hasOppfylt) return 'OPPFYLT'
        if (hasIkkeOppfylt) return 'IKKE_OPPFYLT'
        return 'IKKE_RELEVANT'
    }

    const createArsakerFromSelectedValues = (): VilkaarsvurderingV2Arsak[] => {
        const årsaker: VilkaarsvurderingV2Arsak[] = []

        // Convert selectedValues to årsaker format
        Object.entries(selectedValues).forEach(([spørsmålKode, value]) => {
            if (typeof value === 'string' && value) {
                årsaker.push({
                    kode: spørsmålKode,
                    vurdering: value,
                })
            } else if (Array.isArray(value)) {
                value.forEach((v) => {
                    if (v) {
                        årsaker.push({
                            kode: spørsmålKode,
                            vurdering: v,
                        })
                    }
                })
            }
        })

        return årsaker
    }

    const findAlternativeByKode = (kode: string): AlternativSchema | undefined => {
        const searchInUnderspørsmål = (underspørsmål: UnderspørsmålSchema[]): AlternativSchema | undefined => {
            for (const spørsmål of underspørsmål) {
                if (spørsmål.alternativer) {
                    for (const alt of spørsmål.alternativer) {
                        if (alt.kode === kode) {
                            return alt
                        }
                        if (alt.underspørsmål) {
                            const found = searchInUnderspørsmål(alt.underspørsmål)
                            if (found) return found
                        }
                    }
                }
            }
            return undefined
        }

        return searchInUnderspørsmål(vilkår.underspørsmål)
    }

    const renderUnderspørsmål = (spørsmål: UnderspørsmålSchema): ReactElement => {
        switch (spørsmål.variant) {
            case 'CHECKBOX':
                return (
                    <CheckboxGroup
                        legend={spørsmål.navn}
                        value={(selectedValues[spørsmål.kode] as string[]) || []}
                        onChange={(values) => handleCheckboxChange(spørsmål.kode, values)}
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
                                            {alt.navn}
                                        </Checkbox>
                                        {isSelected &&
                                            alt.underspørsmål?.map((us) => (
                                                <div key={us.kode} className="mt-2 ml-6">
                                                    {renderUnderspørsmål(us)}
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
                        legend={spørsmål.navn}
                        value={(selectedValues[spørsmål.kode] as string) || ''}
                        onChange={(value) => handleRadioChange(spørsmål.kode, value)}
                        size="small"
                    >
                        <VStack gap="3">
                            {spørsmål.alternativer?.map((alt) => {
                                const isSelected = selectedValues[spørsmål.kode] === alt.kode
                                return (
                                    <div key={alt.kode}>
                                        <Radio value={alt.kode} size="small">
                                            {alt.navn}
                                        </Radio>
                                        {isSelected &&
                                            alt.underspørsmål?.map((us) => (
                                                <div key={us.kode} className="mt-2 ml-6">
                                                    {renderUnderspørsmål(us)}
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
                        label={spørsmål.navn}
                        value={(selectedValues[spørsmål.kode] as string) || ''}
                        onChange={(e) => handleSelectChange(spørsmål.kode, e.target.value)}
                        size="small"
                        className="max-w-96"
                    >
                        <option value="">Velg...</option>
                        {spørsmål.alternativer?.map((alt) => (
                            <option key={alt.kode} value={alt.kode}>
                                {alt.navn}
                            </option>
                        ))}
                    </Select>
                )
        }
    }

    return (
        <VStack gap="6">
            {vilkår.underspørsmål.map((spørsmål) => (
                <Fragment key={spørsmål.kode}>{renderUnderspørsmål(spørsmål)}</Fragment>
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
                    onClick={handleSubmit}
                >
                    Lagre vurdering
                </Button>
            </HStack>
        </VStack>
    )
}
