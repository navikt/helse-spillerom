'use client'

import { BodyShort, Button, Heading, HStack, Table, Tabs, Tag, VStack } from '@navikt/ds-react'
import { ReactElement, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TabsList, TabsPanel, TabsTab } from '@navikt/ds-react/Tabs'
import { FilterIcon, MinusIcon, PlusIcon } from '@navikt/aksel-icons'
import { motion } from 'motion/react'

import { useAlleSaksbehandlingsperioder } from '@/hooks/queries/useSaksbehandlingsperioder'
import { Saksbehandlingsperiode, SaksbehandlingsperiodeStatus } from '@/schemas/saksbehandlingsperiode'
import { getFormattedDateString, getFormattedDatetimeString } from '@/utils/date-format'
import { getTestSafeTransition } from '@utils/tsUtils'
import { AnimatePresenceWrapper } from '@components/AnimatePresenceWrapper'

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
    const [showFilters, setShowFilters] = useState<boolean>(false)
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
        <>
            <Heading level="1" size="large" className="sr-only">
                Oppgaveliste
            </Heading>

            <HStack wrap={false} className="h-full">
                <VStack className="h-full border-r border-r-ax-border-neutral-subtle pt-4">
                    <div className="border-b border-b-ax-border-neutral-subtle">
                        <Button
                            className="m-2 mb-[7px] self-start"
                            size="small"
                            variant="tertiary-neutral"
                            icon={<FilterIcon />}
                            onClick={() => setShowFilters((prev) => !prev)}
                        />
                    </div>
                    <AnimatePresenceWrapper initial={false}>
                        {showFilters && (
                            <motion.div
                                key="høyremeny"
                                transition={getTestSafeTransition({
                                    type: 'tween',
                                    duration: 0.2,
                                    ease: 'easeInOut',
                                })}
                                initial={{ width: 0 }}
                                animate={{ width: 'auto' }}
                                exit={{ width: 0 }}
                                className="flex flex-col gap-4 overflow-hidden p-6"
                            >
                                <Filter label="Under behandling" />
                                <Filter label="Beslutter" />
                            </motion.div>
                        )}
                    </AnimatePresenceWrapper>
                </VStack>
                <Tabs value={activeTab} onChange={handleTabChange} className="mb-4 grow pt-4">
                    <TabsList>
                        <TabsTab value="UNDER_BEHANDLING" label="Under behandling" />
                        <TabsTab value="TIL_BESLUTNING" label="Beslutter" />
                        <TabsTab value="GODKJENT" label="Behandlet" />
                    </TabsList>

                    <TabsPanel value="UNDER_BEHANDLING">
                        <OppgaveTabell perioder={filteredPerioder} />
                    </TabsPanel>

                    <TabsPanel value="TIL_BESLUTNING">
                        <OppgaveTabell perioder={filteredPerioder} />
                    </TabsPanel>

                    <TabsPanel value="GODKJENT">
                        <OppgaveTabell perioder={filteredPerioder} />
                    </TabsPanel>
                </Tabs>
            </HStack>
        </>
    )
}

function Filter({ label }: { label: string }): ReactElement {
    return (
        <HStack className="w-60 border-b border-b-ax-border-neutral-subtle pb-4" justify="space-between" wrap={false}>
            <BodyShort className="whitespace-nowrap">{label}</BodyShort>
            <HStack gap="2" wrap={false}>
                <Button size="xsmall" variant="secondary" icon={<PlusIcon />} />
                <Button size="xsmall" variant="secondary" icon={<MinusIcon />} />
            </HStack>
        </HStack>
    )
}

function OppgaveTabell({ perioder }: { perioder: Saksbehandlingsperiode[] }): ReactElement {
    const router = useRouter()

    const handleRadKlikk = (periode: Saksbehandlingsperiode) => {
        router.push(`/person/${periode.spilleromPersonId}/${periode.id}`)
    }

    return (
        <Table zebraStripes>
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
