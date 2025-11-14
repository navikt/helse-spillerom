'use client'

import { BodyShort, Button, Heading, HStack, Table, Tabs, Tag, VStack } from '@navikt/ds-react'
import { Dispatch, ReactElement, SetStateAction, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TabsList, TabsPanel, TabsTab } from '@navikt/ds-react/Tabs'
import { FilterIcon, MinusIcon, PlusIcon } from '@navikt/aksel-icons'
import { motion } from 'motion/react'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

import { useAlleSaksbehandlingsperioder } from '@/hooks/queries/useSaksbehandlingsperioder'
import { Saksbehandlingsperiode, SaksbehandlingsperiodeStatus } from '@/schemas/saksbehandlingsperiode'
import { getFormattedDateString, getFormattedDatetimeString } from '@/utils/date-format'
import { getTestSafeTransition } from '@utils/tsUtils'
import { AnimatePresenceWrapper } from '@components/AnimatePresenceWrapper'
import { useBrukerinfo } from '@hooks/queries/useBrukerinfo'
import { Bruker } from '@schemas/bruker'
import { Filter, filterList, FilterStatus, filtrer } from '@components/oppgaveliste/filter'
import { OppgavelisteSkeleton } from '@components/oppgaveliste/OppgavelisteSkeleton'
import { FetchError } from '@components/saksbilde/FetchError'

type SakerTabs = 'ALLE' | 'MINE' | 'BEHANDLET'

export function Oppgaveliste(): ReactElement {
    const [filters, setFilters] = useState<Filter[]>(filterList)
    const [showFilters, setShowFilters] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<SakerTabs>('ALLE')
    const { data: saksbehandlingsperioder = [], isLoading, error, refetch } = useAlleSaksbehandlingsperioder()
    const { data: aktivBruker } = useBrukerinfo()

    const { mine, behandlet, alle } = splitPerioderForTabs(saksbehandlingsperioder, aktivBruker)

    const handleTabChange = (value: string) => {
        setActiveTab(value as SakerTabs)
    }

    if (isLoading) {
        return <OppgavelisteSkeleton />
    }

    if (error) {
        return (
            <div className="p-8">
                <FetchError message="Kunne ikke laste oppgaveliste" refetch={() => refetch()} />
            </div>
        )
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
                            icon={<FilterIcon aria-label="Filtrer saker" />}
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
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 'auto', opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="flex flex-col gap-4 overflow-hidden p-6"
                            >
                                {filters.map((filter) => (
                                    <FilterRow key={filter.key} filter={filter} setFilters={setFilters} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresenceWrapper>
                </VStack>
                <Tabs value={activeTab} onChange={handleTabChange} className="mb-4 grow pt-4">
                    <TabsList>
                        <TabsTab value="ALLE" label={`Saker (${alle.length})`} />
                        <TabsTab value="MINE" label={`Mine saker (${mine.length})`} />
                        <TabsTab value="BEHANDLET" label={`Behandlet (${behandlet.length})`} />
                    </TabsList>
                    <TabsPanel value="ALLE">
                        <OppgaveTabell perioder={filtrer(alle, filters)} />
                    </TabsPanel>
                    <TabsPanel value="MINE">
                        <OppgaveTabell perioder={filtrer(mine, filters)} />
                    </TabsPanel>
                    <TabsPanel value="BEHANDLET">
                        <OppgaveTabell perioder={filtrer(behandlet, filters)} />
                    </TabsPanel>
                </Tabs>
            </HStack>
        </>
    )
}

export const statusTilTekst: Record<SaksbehandlingsperiodeStatus, string> = {
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

function splitPerioderForTabs(saksbehandlingsperioder: Saksbehandlingsperiode[], aktivBruker?: Bruker) {
    return (saksbehandlingsperioder as Saksbehandlingsperiode[]).reduce(
        (acc, periode) => {
            if (
                (periode.status === 'TIL_BESLUTNING' && periode.beslutterNavIdent === aktivBruker?.navIdent) ||
                periode.opprettetAvNavIdent === aktivBruker?.navIdent
            ) {
                acc.mine.push(periode)
            }
            if (periode.status === 'GODKJENT') {
                acc.behandlet.push(periode)
            }
            acc.alle.push(periode)
            return acc
        },
        {
            mine: [] as Saksbehandlingsperiode[],
            behandlet: [] as Saksbehandlingsperiode[],
            alle: [] as Saksbehandlingsperiode[],
        },
    )
}

function FilterRow({
    filter,
    setFilters,
}: {
    filter: Filter
    setFilters: Dispatch<SetStateAction<Filter[]>>
}): ReactElement {
    const setStatus = (status: FilterStatus) =>
        setFilters((prev) =>
            prev.map((f) =>
                f.key === filter.key ? { ...f, status: f.status === status ? FilterStatus.OFF : status } : f,
            ),
        )

    return (
        <HStack className="w-60 border-b border-b-ax-border-neutral-subtle pb-4" justify="space-between" wrap={false}>
            <BodyShort className="whitespace-nowrap">{filter.label}</BodyShort>
            <HStack gap="2" wrap={false}>
                <Button
                    size="xsmall"
                    variant={filter.status === FilterStatus.PLUS ? 'primary' : 'secondary'}
                    icon={<PlusIcon />}
                    onClick={() => setStatus(FilterStatus.PLUS)}
                />
                <Button
                    size="xsmall"
                    variant={filter.status === FilterStatus.MINUS ? 'danger' : 'secondary'}
                    icon={<MinusIcon />}
                    onClick={() => setStatus(FilterStatus.MINUS)}
                />
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
            <TableHeader>
                <TableRow>
                    <TableHeaderCell>Saksbehandler</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Periode</TableHeaderCell>
                    <TableHeaderCell>Opprettet</TableHeaderCell>
                    <TableHeaderCell>Beslutter</TableHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {perioder.map((periode) => (
                    <TableRow
                        key={periode.id}
                        onClick={() => handleRadKlikk(periode)}
                        className="hover:bg-gray-50 cursor-pointer"
                    >
                        <TableDataCell>{periode.opprettetAvNavn}</TableDataCell>
                        <TableDataCell>
                            <Tag variant={statusTilTagVariant(periode.status)}>{statusTilTekst[periode.status]}</Tag>
                        </TableDataCell>
                        <TableDataCell>
                            {getFormattedDateString(periode.fom)} - {getFormattedDateString(periode.tom)}
                        </TableDataCell>
                        <TableDataCell>{getFormattedDatetimeString(periode.opprettet)}</TableDataCell>
                        <TableDataCell>{periode.beslutterNavIdent || '-'}</TableDataCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
