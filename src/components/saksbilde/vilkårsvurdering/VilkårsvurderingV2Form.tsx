'use client'

import { ReactElement, useState, useEffect, Fragment } from 'react'
import { Button, Checkbox, CheckboxGroup, HStack, Radio, RadioGroup, Select, Textarea, VStack } from '@navikt/ds-react'

import { useOpprettVilkaarsvurdering } from '@hooks/mutations/useOpprettVilkaarsvurdering'
import { Vilkår } from '@schemas/kodeverkV2'
import { Vilkaarsvurdering, Vurdering } from '@schemas/vilkaarsvurdering'

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
    vurdering?: Vilkaarsvurdering
    onSuccess?: () => void
}

export function VilkårsvurderingV2Form({ vilkår, vurdering, onSuccess }: VilkårsvurderingV2FormProps): ReactElement {
    const [selectedValues, setSelectedValues] = useState<Record<string, string | string[]>>({})
    const [notat, setNotat] = useState<string>(vurdering?.notat ?? '')
    const mutation = useOpprettVilkaarsvurdering()

    useEffect(() => {
        if (vurdering) {
            // Initialize form with existing values if available
            // This might need adjustment based on how the API stores V2 data
            setNotat(vurdering.notat ?? '')
        }
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

        // Find the selected reason/årsak
        const selectedReason = findSelectedReason()

        await mutation.mutateAsync({
            kode: vilkår.vilkårskode,
            vurdering: overallAssessment,
            årsak: selectedReason,
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

    const findSelectedReason = (): string => {
        // Find the deepest selected alternative that has an oppfylt status
        for (const value of Object.values(selectedValues)) {
            if (typeof value === 'string') {
                const alternative = findAlternativeByKode(value)
                if (alternative?.oppfylt) {
                    return value
                }
            }
            if (Array.isArray(value)) {
                for (const v of value) {
                    const alternative = findAlternativeByKode(v)
                    if (alternative?.oppfylt) {
                        return v
                    }
                }
            }
        }
        return ''
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
