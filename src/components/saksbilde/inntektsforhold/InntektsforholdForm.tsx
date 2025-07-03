import { Fragment, ReactElement, useState, useEffect } from 'react'
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    HStack,
    Radio,
    RadioGroup,
    Select,
    TextField,
    VStack,
} from '@navikt/ds-react'

import { inntektsforholdKodeverk } from '@components/saksbilde/inntektsforhold/inntektsforholdKodeverk'
import { useOpprettInntektsforhold } from '@hooks/mutations/useOpprettInntektsforhold'
import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'

interface KodeverkAlternativ {
    kode: string
    navn: string
    underspørsmål?: KodeverkSpørsmål[]
}

interface KodeverkSpørsmål {
    kode: string
    navn: string
    variant: 'CHECKBOX' | 'RADIO' | 'TEXTFIELD'
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
    alternativer?: RåKodeverkAlternativ[]
}

interface InntektsforholdFormProps {
    closeForm: () => void
    disabled?: boolean
    initialValues?: Record<string, string | string[]>
    title?: string
    onSubmit?: (kategorisering: Record<string, string | string[]>) => void
    isLoading?: boolean
    avbrytLabel?: string
    lagreLabel?: string
}

export default function InntektsforholdForm({
    closeForm,
    disabled = false,
    initialValues = {},
    title,
    onSubmit,
    isLoading = false,
    avbrytLabel = 'Avbryt',
    lagreLabel = 'Opprett',
}: InntektsforholdFormProps): ReactElement {
    const [selectedValues, setSelectedValues] = useState<Record<string, string | string[]>>(initialValues)
    const mutation = useOpprettInntektsforhold()
    const { data: existingInntektsforhold = [] } = useInntektsforhold()

    useEffect(() => {
        if (Object.keys(initialValues).length > 0) {
            setSelectedValues(initialValues)
        }
    }, [initialValues])

    // Sjekk om det allerede finnes et inntektsforhold med SELVSTENDIG_NÆRINGSDRIVENDE
    const hasExistingSelvstendigNæringsdrivende = existingInntektsforhold.some((forhold) => {
        // Skip checking the current relationship being edited
        if (
            initialValues['INNTEKTSKATEGORI'] === 'SELVSTENDIG_NÆRINGSDRIVENDE' &&
            forhold.kategorisering['INNTEKTSKATEGORI'] === initialValues['INNTEKTSKATEGORI']
        ) {
            return false
        }
        return forhold.kategorisering['INNTEKTSKATEGORI'] === 'SELVSTENDIG_NÆRINGSDRIVENDE'
    })

    // Filtrer bort SELVSTENDIG_NÆRINGSDRIVENDE hvis det allerede finnes
    const availableAlternatives = inntektsforholdKodeverk.alternativer.filter(
        (alt) => !(alt.kode === 'SELVSTENDIG_NÆRINGSDRIVENDE' && hasExistingSelvstendigNæringsdrivende),
    )

    const handleSelectChange = (kode: string, value: string) => {
        if (disabled) return
        setSelectedValues((prev) => ({
            ...prev,
            [kode]: value,
        }))
    }

    const handleRadioChange = (kode: string, value: string) => {
        if (disabled) return
        setSelectedValues((prev) => ({
            ...prev,
            [kode]: value,
        }))
    }

    const handleTextFieldChange = (kode: string, value: string) => {
        if (disabled) return
        setSelectedValues((prev) => ({
            ...prev,
            [kode]: value,
        }))
    }

    function handleSubmit() {
        if (disabled) return
        if (onSubmit) {
            onSubmit(selectedValues)
        } else {
            mutation.mutate(
                {
                    kategorisering: selectedValues,
                },
                {
                    onSuccess: () => {
                        closeForm()
                    },
                },
            )
        }
    }

    const renderUnderspørsmål = (spørsmål: KodeverkSpørsmål) => {
        switch (spørsmål.variant) {
            case 'CHECKBOX':
                return (
                    <CheckboxGroup
                        legend={spørsmål.navn}
                        value={(selectedValues[spørsmål.kode] as string[]) || []}
                        onChange={(values) => {
                            if (disabled) return
                            setSelectedValues((prev) => ({ ...prev, [spørsmål.kode]: values }))
                        }}
                        size="small"
                        disabled={disabled}
                    >
                        <VStack gap="3">
                            {spørsmål.alternativer.map((alt) => {
                                const isSelected = ((selectedValues[spørsmål.kode] as string[]) || []).includes(
                                    alt.kode,
                                )
                                return (
                                    <div key={alt.kode}>
                                        <Checkbox value={alt.kode} size="small" disabled={disabled}>
                                            {alt.navn}
                                        </Checkbox>
                                        {isSelected &&
                                            alt.underspørsmål?.map((us) => (
                                                <div key={us.kode} className="ml-6 mt-2">
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
                        disabled={disabled}
                    >
                        <VStack gap="3">
                            {spørsmål.alternativer.map((alt) => {
                                const isSelected = selectedValues[spørsmål.kode] === alt.kode
                                return (
                                    <div key={alt.kode}>
                                        <Radio value={alt.kode} size="small" disabled={disabled}>
                                            {alt.navn}
                                        </Radio>
                                        {isSelected &&
                                            alt.underspørsmål?.map((us) => (
                                                <div key={us.kode} className="ml-6 mt-2">
                                                    {renderUnderspørsmål(toKodeverkSpørsmål(us))}
                                                </div>
                                            ))}
                                    </div>
                                )
                            })}
                        </VStack>
                    </RadioGroup>
                )
            case 'TEXTFIELD':
                return (
                    <TextField
                        className="max-w-96"
                        label={spørsmål.navn}
                        value={(selectedValues[spørsmål.kode] as string) || ''}
                        onChange={(value) => handleTextFieldChange(spørsmål.kode, value.target.value)}
                        description="9-sifret organisasjonsnummer" // kan ikke hardkodes
                        size="small"
                        disabled={disabled}
                    />
                )
        }
    }

    const selectedAlternativ = inntektsforholdKodeverk.alternativer.find(
        (alt) => alt.kode === (selectedValues[inntektsforholdKodeverk.kode] as string),
    )

    // Helper to ensure variant is typed correctly
    const toKodeverkSpørsmål = (spm: RåKodeverkSpørsmål): KodeverkSpørsmål => ({
        kode: spm.kode,
        navn: spm.navn,
        variant: spm.variant as 'CHECKBOX' | 'RADIO' | 'TEXTFIELD',
        alternativer: spm.alternativer?.map(toKodeverkAlternativ) ?? [],
    })

    const toKodeverkAlternativ = (alt: RåKodeverkAlternativ): KodeverkAlternativ => ({
        kode: alt.kode,
        navn: alt.navn,
        underspørsmål: alt.underspørsmål?.map(toKodeverkSpørsmål),
    })

    return (
        <VStack gap="8">
            {title && <Heading size="small">{title}</Heading>}

            <Select
                label="Velg type inntektsforhold"
                value={(selectedValues[inntektsforholdKodeverk.kode] as string) || ''}
                onChange={(e) => handleSelectChange(inntektsforholdKodeverk.kode, e.target.value)}
                size="small"
                className="max-w-96"
                disabled={disabled}
            >
                <option value="">Velg...</option>
                {availableAlternatives.map((alt) => (
                    <option key={alt.kode} value={alt.kode}>
                        {alt.navn}
                    </option>
                ))}
            </Select>
            {selectedAlternativ?.underspørsmål?.map((spørsmål) => (
                <Fragment key={spørsmål.kode}>{renderUnderspørsmål(toKodeverkSpørsmål(spørsmål))}</Fragment>
            ))}
            {!disabled && (
                <HStack gap="4">
                    <Button
                        variant="primary"
                        size="small"
                        type="button"
                        loading={isLoading || mutation.isPending}
                        disabled={
                            selectedValues[inntektsforholdKodeverk.kode] === undefined ||
                            selectedValues[inntektsforholdKodeverk.kode] === ''
                        }
                        onClick={handleSubmit}
                    >
                        {lagreLabel}
                    </Button>
                    <Button
                        variant="tertiary"
                        size="small"
                        type="button"
                        disabled={isLoading || mutation.isPending}
                        onClick={closeForm}
                    >
                        {avbrytLabel}
                    </Button>
                </HStack>
            )}
        </VStack>
    )
}
