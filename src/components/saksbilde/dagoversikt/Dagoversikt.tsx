'use client'

import { ReactElement, useState } from 'react'
import { 
    Tabs, 
    Table, 
    BodyShort, 
    Heading,
    Alert,
    HStack,
    Tag
} from '@navikt/ds-react'
import { TabsList, TabsTab, TabsPanel } from '@navikt/ds-react/Tabs'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import { useDagoversikt } from '@hooks/queries/useDagoversikt'


interface DagoversiktProps {
    value: string
}

export function Dagoversikt({ value }: DagoversiktProps): ReactElement {
    const { data: inntektsforhold, isLoading: inntektsforholdLoading, isError: inntektsforholdError } = useInntektsforhold()
    
    // Filtrer kun inntektsforhold hvor personen er sykmeldt fra
    const sykmeldingsforhold = inntektsforhold?.filter(forhold => forhold.sykmeldtFraForholdet) || []
    
    const [aktivtInntektsforholdId, setAktivtInntektsforholdId] = useState<string>()
    
    // Sett første sykmeldingsforhold som aktivt hvis det ikke er satt
    const aktivtForhold = aktivtInntektsforholdId ? 
        sykmeldingsforhold.find(f => f.id === aktivtInntektsforholdId) : 
        sykmeldingsforhold[0]
    
    const { data: dagoversikt, isLoading: dagoversiktLoading, isError: dagoversiktError } = useDagoversikt({
        inntektsforholdId: aktivtForhold?.id
    })

    const getInntektsforholdtypeText = (type: string): string => {
        switch (type) {
            case 'ORDINÆRT_ARBEIDSFORHOLD':
                return 'Ordinært arbeidsforhold'
            case 'FRILANSER':
                return 'Frilanser'
            case 'SELVSTENDIG_NÆRINGSDRIVENDE':
                return 'Selvstendig næringsdrivende'
            case 'ARBEIDSLEDIG':
                return 'Arbeidsledig'
            default:
                return type
        }
    }

    const getDagtypeText = (type: string): string => {
        switch (type) {
            case 'SYKEDAG': return 'Sykedag'
            case 'HELGEDAG': return 'Helgedag'
            case 'FERIEDAG': return 'Feriedag'
            case 'ARBEIDSDAG': return 'Arbeidsdag'
            case 'PERMISJONSDAG': return 'Permisjonsdag'
            default: return type
        }
    }

    const getDagtypeVariant = (type: string): "success" | "warning" | "info" | "neutral" | "error" => {
        switch (type) {
            case 'SYKEDAG': return 'error'
            case 'HELGEDAG': return 'neutral'  
            case 'FERIEDAG': return 'info'
            case 'ARBEIDSDAG': return 'success'
            case 'PERMISJONSDAG': return 'warning'
            default: return 'neutral'
        }
    }

    if (inntektsforholdLoading) {
        return <SaksbildePanel value={value}>Laster inntektsforhold...</SaksbildePanel>
    }

    if (inntektsforholdError) {
        return (
            <SaksbildePanel value={value}>
                <Alert variant="error">Kunne ikke laste inntektsforhold</Alert>
            </SaksbildePanel>
        )
    }

    if (sykmeldingsforhold.length === 0) {
        return (
            <SaksbildePanel value={value}>
                <Alert variant="info">
                    <Heading size="small">Ingen sykmeldingsforhold funnet</Heading>
                    <BodyShort>
                        Det finnes ingen inntektsforhold for denne saksbehandlingsperioden hvor personen er sykmeldt fra forholdet.
                    </BodyShort>
                </Alert>
            </SaksbildePanel>
        )
    }

    return (
        <SaksbildePanel value={value}>
            <Heading size="medium" className="mb-4">Dagoversikt</Heading>
            
            <Tabs 
                value={aktivtForhold?.id || sykmeldingsforhold[0]?.id} 
                onChange={(value) => setAktivtInntektsforholdId(value)}
            >
                <TabsList>
                    {sykmeldingsforhold.map((forhold) => (
                        <TabsTab 
                            key={forhold.id} 
                            value={forhold.id}
                            label={`${getInntektsforholdtypeText(forhold.inntektsforholdtype)}${forhold.orgnavn ? ` - ${forhold.orgnavn}` : ''}`}
                        />
                    ))}
                </TabsList>

                {sykmeldingsforhold.map((forhold) => (
                    <TabsPanel key={forhold.id} value={forhold.id}>
                        {dagoversiktLoading && (
                            <BodyShort>Laster dagoversikt...</BodyShort>
                        )}
                        
                        {dagoversiktError && (
                            <Alert variant="error">Kunne ikke laste dagoversikt</Alert>
                        )}
                        
                        {dagoversikt && dagoversikt.length > 0 && (
                            <Table size="medium">
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell>Dato</TableHeaderCell>
                                        <TableHeaderCell>Dagtype</TableHeaderCell>
                                        <TableHeaderCell>Status</TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dagoversikt.map((dag) => (
                                        <TableRow key={dag.id}>
                                            <TableDataCell>
                                                <BodyShort>
                                                    {new Date(dag.dato).toLocaleDateString('nb-NO', {
                                                        weekday: 'short',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </BodyShort>
                                            </TableDataCell>
                                            <TableDataCell>
                                                <BodyShort>{getDagtypeText(dag.type)}</BodyShort>
                                            </TableDataCell>
                                            <TableDataCell>
                                                <Tag variant={getDagtypeVariant(dag.type)} size="small">
                                                    {getDagtypeText(dag.type)}
                                                </Tag>
                                            </TableDataCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        
                        {dagoversikt && dagoversikt.length === 0 && (
                            <Alert variant="info">
                                Ingen dagoversikt funnet for dette inntektsforholdet.
                            </Alert>
                        )}
                    </TabsPanel>
                ))}
            </Tabs>
        </SaksbildePanel>
    )
}
