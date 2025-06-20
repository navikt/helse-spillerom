'use client'

import { Fragment, ReactElement, useState } from 'react'
import { BodyShort, Button, Detail, HStack, Modal, Table, VStack } from '@navikt/ds-react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'

import { useAareg } from '@hooks/queries/useAareg'
import { Arbeidsforhold } from '@schemas/aareg'
import { cn } from '@utils/tw'

export function AaregKnapp(): ReactElement {
    const [open, setOpen] = useState(false)
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
    const { data: arbeidsforhold, isLoading } = useAareg()

    const toggleRow = (id: string) => {
        const newExpandedRows = new Set(expandedRows)
        if (newExpandedRows.has(id)) {
            newExpandedRows.delete(id)
        } else {
            newExpandedRows.add(id)
        }
        setExpandedRows(newExpandedRows)
    }

    const isMaritimtArbeidsforhold = (forhold: Arbeidsforhold) => {
        return forhold.type.kode === 'maritimtArbeidsforhold'
    }

    const hasUtenriksfart = (forhold: Arbeidsforhold) => {
        return forhold.ansettelsesdetaljer.some((detalj) => detalj.fartsomraade?.kode === 'utenriks')
    }

    return (
        <>
            <Button variant="secondary" onClick={() => setOpen(true)} aria-label="Vis arbeidsforhold fra Aa-registeret">
                Arbeidsforhold
            </Button>
            <Modal open={open} onClose={() => setOpen(false)} header={{ heading: 'Arbeidsforhold' }}>
                <Modal.Body>
                    {isLoading ? (
                        <div role="status" aria-live="polite">
                            Laster arbeidsforhold...
                        </div>
                    ) : !arbeidsforhold || arbeidsforhold.length === 0 ? (
                        <div>Ingen arbeidsforhold funnet</div>
                    ) : (
                        <div role="region" aria-label="Arbeidsforhold oversikt">
                            <Table aria-label="Arbeidsforhold tabell">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Type</Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Arbeidssted</Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Startdato</Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Stillingsprosent</Table.HeaderCell>
                                        <Table.HeaderCell scope="col">Yrke</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {arbeidsforhold.map((forhold) => (
                                        <Fragment key={forhold.id}>
                                            <Table.Row
                                                key={forhold.id}
                                                className={cn(
                                                    'cursor-pointer',
                                                    isMaritimtArbeidsforhold(forhold) &&
                                                        hasUtenriksfart(forhold) &&
                                                        'bg-orange-50',
                                                )}
                                                onClick={() => toggleRow(forhold.id)}
                                                aria-expanded={expandedRows.has(forhold.id)}
                                                aria-controls={`arbeidsforhold-detaljer-${forhold.id}`}
                                            >
                                                <Table.DataCell>
                                                    {expandedRows.has(forhold.id) ? (
                                                        <ChevronUpIcon aria-hidden />
                                                    ) : (
                                                        <ChevronDownIcon aria-hidden />
                                                    )}
                                                </Table.DataCell>
                                                <Table.DataCell>
                                                    <HStack gap="2" align="center">
                                                        {forhold.type.beskrivelse}
                                                        {isMaritimtArbeidsforhold(forhold) &&
                                                            hasUtenriksfart(forhold) && (
                                                                <Detail className="text-orange-600">
                                                                    Utenriksfart
                                                                </Detail>
                                                            )}
                                                    </HStack>
                                                </Table.DataCell>
                                                <Table.DataCell>{forhold.arbeidssted.identer[0]?.ident}</Table.DataCell>
                                                <Table.DataCell>{forhold.ansettelsesperiode.startdato}</Table.DataCell>
                                                <Table.DataCell>
                                                    {forhold.ansettelsesdetaljer[0]?.avtaltStillingsprosent}%
                                                </Table.DataCell>
                                                <Table.DataCell>
                                                    {forhold.ansettelsesdetaljer[0]?.yrke?.beskrivelse}
                                                </Table.DataCell>
                                            </Table.Row>
                                            {expandedRows.has(forhold.id) && (
                                                <Table.Row>
                                                    <Table.DataCell colSpan={6}>
                                                        <VStack
                                                            gap="2"
                                                            className="p-4"
                                                            id={`arbeidsforhold-detaljer-${forhold.id}`}
                                                        >
                                                            <HStack gap="4">
                                                                <div>
                                                                    <Detail>Arbeidstaker</Detail>
                                                                    <BodyShort>
                                                                        {forhold.arbeidstaker.identer
                                                                            .map(
                                                                                (ident) =>
                                                                                    `${ident.type}: ${ident.ident}`,
                                                                            )
                                                                            .join(', ')}
                                                                    </BodyShort>
                                                                </div>
                                                                <div>
                                                                    <Detail>Opplysningspliktig</Detail>
                                                                    <BodyShort>
                                                                        {forhold.opplysningspliktig.identer
                                                                            .map(
                                                                                (ident) =>
                                                                                    `${ident.type}: ${ident.ident}`,
                                                                            )
                                                                            .join(', ')}
                                                                    </BodyShort>
                                                                </div>
                                                            </HStack>
                                                            {forhold.ansettelsesdetaljer.map((detalj, index) => (
                                                                <div key={index}>
                                                                    <Detail>Ansettelsesdetaljer</Detail>
                                                                    <VStack gap="1">
                                                                        {detalj.arbeidstidsordning && (
                                                                            <BodyShort>
                                                                                Arbeidstidsordning:{' '}
                                                                                {detalj.arbeidstidsordning.beskrivelse}
                                                                            </BodyShort>
                                                                        )}
                                                                        {detalj.ansettelsesform && (
                                                                            <BodyShort>
                                                                                Ansettelsesform:{' '}
                                                                                {detalj.ansettelsesform.beskrivelse}
                                                                            </BodyShort>
                                                                        )}
                                                                        {detalj.fartsomraade && (
                                                                            <BodyShort>
                                                                                Fartsområde:{' '}
                                                                                {detalj.fartsomraade.beskrivelse}
                                                                            </BodyShort>
                                                                        )}
                                                                        {detalj.skipsregister && (
                                                                            <BodyShort>
                                                                                Skipsregister:{' '}
                                                                                {detalj.skipsregister.beskrivelse}
                                                                            </BodyShort>
                                                                        )}
                                                                        {detalj.fartoeystype && (
                                                                            <BodyShort>
                                                                                Fartøystype:{' '}
                                                                                {detalj.fartoeystype.beskrivelse}
                                                                            </BodyShort>
                                                                        )}
                                                                        {detalj.antallTimerPrUke && (
                                                                            <BodyShort>
                                                                                Antall timer per uke:{' '}
                                                                                {detalj.antallTimerPrUke}
                                                                            </BodyShort>
                                                                        )}
                                                                    </VStack>
                                                                </div>
                                                            ))}
                                                        </VStack>
                                                    </Table.DataCell>
                                                </Table.Row>
                                            )}
                                        </Fragment>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </>
    )
}
