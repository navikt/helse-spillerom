import { Fragment, ReactElement, useState } from 'react'
import { BodyShort, Button, Detail, HStack, Table, Tag, VStack } from '@navikt/ds-react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'

import { Arbeidsforhold } from '@schemas/aareg'
import { getFormattedDateString } from '@utils/date-format'
import { Organisasjonsnavn } from '@/components/organisasjon/Organisasjonsnavn'

interface ArbeidsforholdVisningProps {
    arbeidsforhold: Arbeidsforhold[]
}

export function ArbeidsforholdVisning({ arbeidsforhold }: ArbeidsforholdVisningProps): ReactElement {
    const [expandedForhold, setExpandedForhold] = useState<Set<string>>(new Set())

    const toggleForhold = (id: string) => {
        setExpandedForhold((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    const formatDate = (dateString: string) => {
        try {
            return getFormattedDateString(dateString)
        } catch {
            return dateString
        }
    }

    const getOrganisasjonsnummer = (arbeidssted: { type: string; identer: Array<{ type: string; ident: string }> }) => {
        const orgNr = arbeidssted.identer.find((ident) => ident.type === 'ORGANISASJONSNUMMER')
        return orgNr?.ident || 'Ukjent'
    }

    const getAktivStatus = (periode: { startdato: string; sluttdato?: string | null }) => {
        if (!periode.sluttdato) {
            return { status: 'Aktiv', variant: 'success' as const }
        }
        const sluttDato = new Date(periode.sluttdato)
        const idag = new Date()
        if (sluttDato > idag) {
            return { status: 'Aktiv', variant: 'success' as const }
        }
        return { status: 'Avsluttet', variant: 'neutral' as const }
    }

    return (
        <VStack gap="space-8" className="mt-2">
            <Detail className="text-ax-neutral-700">Viser {arbeidsforhold.length} arbeidsforhold</Detail>

            <Table size="small" className="w-full">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col"></Table.HeaderCell>
                        <Table.HeaderCell scope="col">Arbeidssted</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {arbeidsforhold.map((forhold) => {
                        const isExpanded = expandedForhold.has(forhold.id)
                        const aktivStatus = getAktivStatus(forhold.ansettelsesperiode)

                        return (
                            <Fragment key={forhold.id}>
                                <Table.Row>
                                    <Table.DataCell>
                                        <Button
                                            variant="tertiary"
                                            size="xsmall"
                                            onClick={() => toggleForhold(forhold.id)}
                                            icon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                            iconPosition="right"
                                        ></Button>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <BodyShort size="small">
                                            <Organisasjonsnavn
                                                orgnummer={getOrganisasjonsnummer(forhold.arbeidssted)}
                                            />
                                        </BodyShort>
                                        <BodyShort size="small" className="text-ax-neutral-900">
                                            {getOrganisasjonsnummer(forhold.arbeidssted)}
                                        </BodyShort>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <Tag size="xsmall" variant={aktivStatus.variant}>
                                            {aktivStatus.status}
                                        </Tag>
                                    </Table.DataCell>
                                </Table.Row>
                                {isExpanded && (
                                    <Table.Row className="bg-ax-neutral-100">
                                        <Table.DataCell colSpan={4}>
                                            <VStack gap="space-12" className="p-3">
                                                {/* Ansettelsesperiode */}
                                                {forhold.type.beskrivelse}
                                                <div className="border-l-4 border-ax-border-info pl-3">
                                                    <Detail className="mb-1 text-xs text-ax-neutral-700">
                                                        Ansettelsesperiode
                                                    </Detail>
                                                    <HStack gap="space-16">
                                                        <VStack gap="space-4">
                                                            <Detail className="text-xs text-ax-neutral-700">Fra</Detail>
                                                            <BodyShort size="small">
                                                                {formatDate(forhold.ansettelsesperiode.startdato)}
                                                            </BodyShort>
                                                        </VStack>
                                                        {forhold.ansettelsesperiode.sluttdato && (
                                                            <VStack gap="space-4">
                                                                <Detail className="text-xs text-ax-neutral-700">
                                                                    Til
                                                                </Detail>
                                                                <BodyShort size="small">
                                                                    {formatDate(forhold.ansettelsesperiode.sluttdato)}
                                                                </BodyShort>
                                                            </VStack>
                                                        )}
                                                    </HStack>
                                                </div>

                                                {/* Ansettelsesdetaljer */}
                                                {forhold.ansettelsesdetaljer.map((detalj, index) => (
                                                    <div
                                                        key={index}
                                                        className="border-l-4 border-ax-border-success pl-3"
                                                    >
                                                        <Detail className="mb-2 text-xs text-ax-neutral-700">
                                                            Ansettelsesdetaljer ({detalj.type})
                                                        </Detail>
                                                        <VStack gap="space-8">
                                                            <HStack gap="space-16" wrap>
                                                                {detalj.yrke && (
                                                                    <VStack gap="space-4">
                                                                        <Detail className="text-xs text-ax-neutral-700">
                                                                            Yrke
                                                                        </Detail>
                                                                        <BodyShort size="small">
                                                                            {detalj.yrke.beskrivelse}
                                                                        </BodyShort>
                                                                    </VStack>
                                                                )}
                                                                {detalj.ansettelsesform && (
                                                                    <VStack gap="space-4">
                                                                        <Detail className="text-xs text-ax-neutral-700">
                                                                            Ansettelsesform
                                                                        </Detail>
                                                                        <BodyShort size="small">
                                                                            {detalj.ansettelsesform.beskrivelse}
                                                                        </BodyShort>
                                                                    </VStack>
                                                                )}
                                                                {detalj.avtaltStillingsprosent && (
                                                                    <VStack gap="space-4">
                                                                        <Detail className="text-xs text-ax-neutral-700">
                                                                            Stillingsprosent
                                                                        </Detail>
                                                                        <BodyShort size="small">
                                                                            {detalj.avtaltStillingsprosent}%
                                                                        </BodyShort>
                                                                    </VStack>
                                                                )}
                                                            </HStack>
                                                            <HStack gap="space-16" wrap>
                                                                {detalj.antallTimerPrUke && (
                                                                    <VStack gap="space-4">
                                                                        <Detail className="text-xs text-ax-neutral-700">
                                                                            Timer pr. uke
                                                                        </Detail>
                                                                        <BodyShort size="small">
                                                                            {detalj.antallTimerPrUke}
                                                                        </BodyShort>
                                                                    </VStack>
                                                                )}
                                                                {detalj.arbeidstidsordning && (
                                                                    <VStack gap="space-4">
                                                                        <Detail className="text-xs text-ax-neutral-700">
                                                                            Arbeidstidsordning
                                                                        </Detail>
                                                                        <BodyShort size="small">
                                                                            {detalj.arbeidstidsordning.beskrivelse}
                                                                        </BodyShort>
                                                                    </VStack>
                                                                )}
                                                            </HStack>
                                                            {/* Spesielle felt for maritime arbeidsforhold */}
                                                            {detalj.type === 'Maritim' && (
                                                                <HStack gap="space-16" wrap>
                                                                    {detalj.fartsomraade && (
                                                                        <VStack gap="space-4">
                                                                            <Detail className="text-xs text-ax-neutral-700">
                                                                                Fartsområde
                                                                            </Detail>
                                                                            <BodyShort size="small">
                                                                                {detalj.fartsomraade.beskrivelse}
                                                                            </BodyShort>
                                                                        </VStack>
                                                                    )}
                                                                    {detalj.fartoeystype && (
                                                                        <VStack gap="space-4">
                                                                            <Detail className="text-xs text-ax-neutral-700">
                                                                                Fartøystype
                                                                            </Detail>
                                                                            <BodyShort size="small">
                                                                                {detalj.fartoeystype.beskrivelse}
                                                                            </BodyShort>
                                                                        </VStack>
                                                                    )}
                                                                </HStack>
                                                            )}
                                                        </VStack>
                                                    </div>
                                                ))}

                                                {/* Metadata */}
                                                <div className="border-l-4 border-ax-border-neutral-subtle pl-3">
                                                    <Detail className="mb-2 text-xs text-ax-neutral-700">
                                                        Metadata
                                                    </Detail>
                                                    <HStack gap="space-16" wrap>
                                                        <VStack gap="space-4">
                                                            <Detail className="text-xs text-ax-neutral-700">
                                                                NAV Arbeidsforhold ID
                                                            </Detail>
                                                            <BodyShort size="small">
                                                                {forhold.navArbeidsforholdId}
                                                            </BodyShort>
                                                        </VStack>
                                                        <VStack gap="space-4">
                                                            <Detail className="text-xs text-ax-neutral-700">
                                                                Rapporteringsordning
                                                            </Detail>
                                                            <BodyShort size="small">
                                                                {forhold.rapporteringsordning.beskrivelse}
                                                            </BodyShort>
                                                        </VStack>
                                                        <VStack gap="space-4">
                                                            <Detail className="text-xs text-ax-neutral-700">
                                                                Sist bekreftet
                                                            </Detail>
                                                            <BodyShort size="small">
                                                                {formatDate(forhold.sistBekreftet)}
                                                            </BodyShort>
                                                        </VStack>
                                                    </HStack>
                                                </div>
                                            </VStack>
                                        </Table.DataCell>
                                    </Table.Row>
                                )}
                            </Fragment>
                        )
                    })}
                </Table.Body>
            </Table>
        </VStack>
    )
}
