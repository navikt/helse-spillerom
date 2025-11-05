import React, { ReactElement, useMemo, useState } from 'react'
import {
    Button,
    Chips,
    Radio,
    RadioGroup,
    Textarea,
    TextField,
    UNSAFE_Combobox as Combobox,
    VStack,
} from '@navikt/ds-react'

import { useBeregningsregler } from '@hooks/queries/useBeregningsregler'

type ÅrsakTilFrihånd = 'MANGLER_STØTTE_I_SPILLEROM' | 'OVERTATT_SAK_FRA_SPEIL' | 'OVERTATT_SAK_FRA_INFOTRYGD'

interface ValgtÅrsak {
    kode: string
    beskrivelse: string
}

export function FrihåndSykepengegrunnlag({ onAvbryt }: { onAvbryt: () => void }): ReactElement {
    const [årsakTilFrihånd, setÅrsakTilFrihånd] = useState<ÅrsakTilFrihånd | ''>('')
    const [valgteÅrsaker, setValgteÅrsaker] = useState<ValgtÅrsak[]>([])
    const [sykepengegrunnlag, setSykepengegrunnlag] = useState('')
    const [begrunnelse, setBegrunnelse] = useState('')

    const { data: beregningsregler } = useBeregningsregler()

    // Filtrer beregningsregler som har SYKEPENGEGRUNNLAG i kodeverdien
    // Fjern duplikater basert på kode for å unngå duplikate keys i Combobox
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
            setValgteÅrsaker([...valgteÅrsaker, { kode, beskrivelse: regel.beskrivelse }])
        }
    }

    const handleFjernÅrsak = (kode: string) => {
        setValgteÅrsaker(valgteÅrsaker.filter((årsak) => årsak.kode !== kode))
    }

    return (
        <VStack gap="6" className="p-8">
            <RadioGroup
                legend="Årsak til frihånd"
                value={årsakTilFrihånd || ''}
                onChange={(value) => {
                    setÅrsakTilFrihånd((value || '') as ÅrsakTilFrihånd | '')
                    // Nullstill valgte årsaker og begrunnelse når årsak endres
                    if (value !== 'MANGLER_STØTTE_I_SPILLEROM') {
                        setValgteÅrsaker([])
                        setBegrunnelse('')
                    }
                }}
            >
                <Radio value="MANGLER_STØTTE_I_SPILLEROM">Mangler støtte i spillerom</Radio>
                <Radio value="OVERTATT_SAK_FRA_SPEIL">Overtatt sak fra speil</Radio>
                <Radio value="OVERTATT_SAK_FRA_INFOTRYGD">Overtatt sak fra infotrygd</Radio>
            </RadioGroup>

            {visÅrsakerCombobox && (
                <VStack gap="4">
                    <Combobox
                        label="Årsaker"
                        options={sykepengegrunnlagKoder}
                        onToggleSelected={(option) => {
                            handleLeggTilÅrsak(option)
                        }}
                    />
                    {valgteÅrsaker.length > 0 && (
                        <VStack gap="2">
                            <Chips>
                                {valgteÅrsaker.map((årsak) => (
                                    <Chips.Removable key={årsak.kode} onDelete={() => handleFjernÅrsak(årsak.kode)}>
                                        {årsak.beskrivelse}
                                    </Chips.Removable>
                                ))}
                            </Chips>
                        </VStack>
                    )}
                </VStack>
            )}

            <TextField
                label="Sykepengegrunnlag"
                value={sykepengegrunnlag}
                onChange={(e) => setSykepengegrunnlag(e.target.value)}
            />

            {årsakTilFrihånd === 'MANGLER_STØTTE_I_SPILLEROM' && (
                <Textarea
                    label="Begrunnelse til beslutter"
                    value={begrunnelse}
                    onChange={(e) => setBegrunnelse(e.target.value)}
                    minRows={6}
                />
            )}

            <div className="flex gap-2">
                <Button variant="secondary" onClick={onAvbryt}>
                    Avbryt
                </Button>
                <Button variant="secondary" onClick={onAvbryt}>
                    Lagre
                </Button>
            </div>
        </VStack>
    )
}
