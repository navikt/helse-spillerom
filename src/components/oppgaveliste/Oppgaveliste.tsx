'use client'

import { Heading, Table, Tabs, Tag } from '@navikt/ds-react'
import { ReactElement, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAlleSaksbehandlingsperioder } from '@/hooks/queries/useSaksbehandlingsperioder'
import { Saksbehandlingsperiode, SaksbehandlingsperiodeStatus } from '@/schemas/saksbehandlingsperiode'
import { getFormattedDateString, getFormattedDatetimeString } from '@/utils/date-format'

type FilterType = 'UNDER_BEHANDLING' | 'TIL_BESLUTNING' | 'GODKJENT'

const statusTilTekst: Record<SaksbehandlingsperiodeStatus, string> = {
    UNDER_BEHANDLING: 'Under behandling',
    TIL_BESLUTNING: 'Til beslutning',
    UNDER_BESLUTNING: 'Under beslutning',
    GODKJENT: 'Godkjent',
}

const statusTilTagVariant = (status: SaksbehandlingsperiodeStatus): 'info' | 'warning' | 'success' => {
    switch (status) {
        case 'UNDER_BEHANDLING':
            return 'info'
        case 'TIL_BESLUTNING':
            return 'warning'
        case 'UNDER_BESLUTNING':
            return 'warning'
        case 'GODKJENT':
            return 'success'
        default:
            return 'info'
    }
}

export function Oppgaveliste(): ReactElement {
    const [activeTab, setActiveTab] = useState<FilterType>('UNDER_BEHANDLING')
    const { data: saksbehandlingsperioder = [], isLoading, error } = useAlleSaksbehandlingsperioder()

    const filteredPerioder = (saksbehandlingsperioder as Saksbehandlingsperiode[]).filter(
        (periode: Saksbehandlingsperiode) => {
            if (activeTab === 'TIL_BESLUTNING') {
                return periode.status === 'TIL_BESLUTNING' || periode.status === 'UNDER_BESLUTNING'
            } else if (activeTab === 'GODKJENT') {
                return periode.status === 'GODKJENT'
            } else {
                return periode.status === 'UNDER_BEHANDLING'
            }
        },
    )

    const handleTabChange = (value: string) => {
        setActiveTab(value as FilterType)
    }

    if (isLoading) {
        return <div>Laster...</div>
    }

    if (error) {
        return <div>Noe gikk galt: {error.message}</div>
    }

    return (
        <div className="p-4">
            <Heading level="1" size="large" className="sr-only">
                Oppgaveliste
            </Heading>

            <Tabs value={activeTab} onChange={handleTabChange} className="mb-4">
                <Tabs.List>
                    <Tabs.Tab value="UNDER_BEHANDLING" label="Under behandling" />
                    <Tabs.Tab value="TIL_BESLUTNING" label="Beslutter" />
                    <Tabs.Tab value="GODKJENT" label="Behandlet" />
                </Tabs.List>

                <Tabs.Panel value="UNDER_BEHANDLING">
                    <OppgaveTabell perioder={filteredPerioder} />
                </Tabs.Panel>

                <Tabs.Panel value="TIL_BESLUTNING">
                    <OppgaveTabell perioder={filteredPerioder} />
                </Tabs.Panel>

                <Tabs.Panel value="GODKJENT">
                    <OppgaveTabell perioder={filteredPerioder} />
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}

function OppgaveTabell({ perioder }: { perioder: Saksbehandlingsperiode[] }): ReactElement {
    const router = useRouter()

    const handleRadKlikk = (periode: Saksbehandlingsperiode) => {
        router.push(`/person/${periode.spilleromPersonId}/${periode.id}`)
    }

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Saksbehandler</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Periode</Table.HeaderCell>
                    <Table.HeaderCell>Opprettet</Table.HeaderCell>
                    <Table.HeaderCell>Beslutter</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {perioder.map((periode) => (
                    <Table.Row
                        key={periode.id}
                        onClick={() => handleRadKlikk(periode)}
                        className="hover:bg-gray-50 cursor-pointer"
                    >
                        <Table.DataCell>{periode.opprettetAvNavn}</Table.DataCell>
                        <Table.DataCell>
                            <Tag variant={statusTilTagVariant(periode.status)}>{statusTilTekst[periode.status]}</Tag>
                        </Table.DataCell>
                        <Table.DataCell>
                            {getFormattedDateString(periode.fom)} - {getFormattedDateString(periode.tom)}
                        </Table.DataCell>
                        <Table.DataCell>{getFormattedDatetimeString(periode.opprettet)}</Table.DataCell>
                        <Table.DataCell>{periode.beslutter || '-'}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}
