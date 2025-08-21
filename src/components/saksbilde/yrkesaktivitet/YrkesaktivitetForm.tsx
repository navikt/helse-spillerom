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

import { yrkesaktivitetKodeverk } from '@components/saksbilde/yrkesaktivitet/yrkesaktivitetKodeverk'
import { useOpprettYrkesaktivitet } from '@hooks/mutations/useOpprettYrkesaktivitet'
import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { useKanSaksbehandles } from '@hooks/queries/useKanSaksbehandles'

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

interface YrkesaktivitetFormProps {
    closeForm: () => void
    disabled?: boolean
    initialValues?: Record<string, string | string[]>
    title?: string
    onSubmit?: (kategorisering: Record<string, string | string[]>) => void
    isLoading?: boolean
    avbrytLabel?: string
    lagreLabel?: string
}

export default function YrkesaktivitetForm({
    closeForm,
    disabled = false,
    initialValues = {},
    title,
    onSubmit,
    isLoading = false,
    avbrytLabel = 'Avbryt',
    lagreLabel = 'Opprett',
}: YrkesaktivitetFormProps): ReactElement {
    const [selectedValues, setSelectedValues] = useState<Record<string, string | string[]>>(initialValues)
    const mutation = useOpprettYrkesaktivitet()
    const { data: existingYrkesaktivitet = [] } = useYrkesaktivitet()
    const kansaksbehandles = useKanSaksbehandles()

    useEffect(() => {
        if (Object.keys(initialValues).length > 0) {
            setSelectedValues(initialValues)
        }
    }, [initialValues])

    // Sjekk om det allerede finnes en yrkesaktivitet med SELVSTENDIG_NÆRINGSDRIVENDE
    const hasExistingSelvstendigNæringsdrivende = existingYrkesaktivitet.some((aktivitet) => {
        // Skip checking the current relationship being edited
        if (
            initialValues['INNTEKTSKATEGORI'] === 'SELVSTENDIG_NÆRINGSDRIVENDE' &&
            aktivitet.kategorisering['INNTEKTSKATEGORI'] === initialValues['INNTEKTSKATEGORI']
        ) {
            return false
        }
        return aktivitet.kategorisering['INNTEKTSKATEGORI'] === 'SELVSTENDIG_NÆRINGSDRIVENDE'
    })

    // Filtrer bort SELVSTENDIG_NÆRINGSDRIVENDE hvis det allerede finnes
    const availableAlternatives = yrkesaktivitetKodeverk.alternativer.filter(
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

    const selectedAlternativ = yrkesaktivitetKodeverk.alternativer.find(
        (alt) => alt.kode === (selectedValues[yrkesaktivitetKodeverk.kode] as string),
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
                label="Velg type yrkesaktivitet"
                value={(selectedValues[yrkesaktivitetKodeverk.kode] as string) || ''}
                onChange={(e) => handleSelectChange(yrkesaktivitetKodeverk.kode, e.target.value)}
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
            {!disabled && kansaksbehandles && (
                <HStack gap="4">
                    <Button
                        variant="primary"
                        size="small"
                        type="button"
                        loading={isLoading || mutation.isPending}
                        disabled={
                            selectedValues[yrkesaktivitetKodeverk.kode] === undefined ||
                            selectedValues[yrkesaktivitetKodeverk.kode] === ''
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
