'use client'

import { Heading, Select, CheckboxGroup, Checkbox, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { inntektsforholdKodeverk } from '@/components/saksbilde/inntektsforhold/InntektsforholdKodeverk'

interface KodeverkAlternativ {
    kode: string
    navn: string
    underspørsmål?: KodeverkSpørsmål[]
}

interface KodeverkSpørsmål {
    kode: string
    navn: string
    variant: 'SELECT' | 'CHECKBOX' | 'RADIO'
    alternativer: KodeverkAlternativ[]
}

interface RåKodeverkAlternativ {
    kode: string
    navn: string
    underspørsmål?: RåKodeverkSpørsmål[]
}

interface RåKodeverkSpørsmål {
    kode: string
    navn: string
    variant: string
    alternativer: RåKodeverkAlternativ[]
}

export default function InntektsforholdPage() {
    const [selectedValues, setSelectedValues] = useState<Record<string, string | string[]>>({})

    const handleSelectChange = (kode: string, value: string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [kode]: value,
        }))
    }

    const handleRadioChange = (kode: string, value: string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [kode]: value,
        }))
    }

    const renderUnderspørsmål = (spørsmål: KodeverkSpørsmål) => {
        switch (spørsmål.variant) {
            case 'SELECT':
                return (
                    <Select
                        label={spørsmål.navn}
                        value={(selectedValues[spørsmål.kode] as string) || ''}
                        onChange={(e) => handleSelectChange(spørsmål.kode, e.target.value)}
                        size="small"
                    >
                        <option value="">Velg...</option>
                        {spørsmål.alternativer.map((alt) => (
                            <option key={alt.kode} value={alt.kode}>
                                {alt.navn}
                            </option>
                        ))}
                    </Select>
                )
            case 'CHECKBOX':
                return (
                    <CheckboxGroup
                        legend={spørsmål.navn}
                        value={(selectedValues[spørsmål.kode] as string[]) || []}
                        onChange={(values) => {
                            setSelectedValues((prev) => ({ ...prev, [spørsmål.kode]: values }))
                        }}
                        size="small"
                    >
                        <VStack gap="3">
                            {spørsmål.alternativer.map((alt) => {
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
                                                    {renderUnderspørsmål(toKodeverkSpørsmål(us))}
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
                            {spørsmål.alternativer.map((alt) => {
                                const isSelected = selectedValues[spørsmål.kode] === alt.kode
                                return (
                                    <div key={alt.kode}>
                                        <Radio value={alt.kode} size="small">
                                            {alt.navn}
                                        </Radio>
                                        {isSelected &&
                                            alt.underspørsmål?.map((us) => (
                                                <div key={us.kode} className="mt-2 ml-6">
                                                    {renderUnderspørsmål(toKodeverkSpørsmål(us))}
                                                </div>
                                            ))}
                                    </div>
                                )
                            })}
                        </VStack>
                    </RadioGroup>
                )
        }
    }

    const selectedKode = selectedValues[inntektsforholdKodeverk.kode] as string
    const selectedAlternativ = inntektsforholdKodeverk.alternativer.find((alt) => alt.kode === selectedKode)

    // Helper to ensure variant is typed correctly
    const toKodeverkSpørsmål = (spm: RåKodeverkSpørsmål): KodeverkSpørsmål => ({
        kode: spm.kode,
        navn: spm.navn,
        variant: spm.variant as 'SELECT' | 'CHECKBOX' | 'RADIO',
        alternativer: spm.alternativer.map(toKodeverkAlternativ),
    })

    const toKodeverkAlternativ = (alt: RåKodeverkAlternativ): KodeverkAlternativ => ({
        kode: alt.kode,
        navn: alt.navn,
        underspørsmål: alt.underspørsmål?.map(toKodeverkSpørsmål),
    })

    return (
        <div className="container mx-auto p-6">
            <Heading size="large" level="1" spacing>
                {inntektsforholdKodeverk.navn}
            </Heading>
            <VStack gap="6">
                <Select
                    label="Velg type inntektsforhold"
                    value={selectedKode || ''}
                    onChange={(e) => handleSelectChange(inntektsforholdKodeverk.kode, e.target.value)}
                    size="small"
                >
                    <option value="">Velg...</option>
                    {inntektsforholdKodeverk.alternativer.map((alt) => (
                        <option key={alt.kode} value={alt.kode}>
                            {alt.navn}
                        </option>
                    ))}
                </Select>
                {selectedAlternativ?.underspørsmål?.map((spørsmål) => (
                    <div key={spørsmål.kode}>{renderUnderspørsmål(toKodeverkSpørsmål(spørsmål))}</div>
                ))}
            </VStack>
        </div>
    )
}
