import { ReactElement } from 'react'
import { Button, HStack, Skeleton, Table, Tabs, VStack } from '@navikt/ds-react'
import { FilterIcon } from '@navikt/aksel-icons'
import { TabsList, TabsPanel, TabsTab } from '@navikt/ds-react/Tabs'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

export function OppgavelisteSkeleton(): ReactElement {
    return (
        <HStack wrap={false} className="h-full">
            <VStack className="h-full border-r border-r-ax-border-neutral-subtle pt-4">
                <div className="border-b border-b-ax-border-neutral-subtle">
                    <Button
                        className="m-2 mb-[7px] self-start"
                        size="small"
                        variant="tertiary-neutral"
                        icon={<FilterIcon aria-label="Filtrer saker" />}
                    />
                </div>
            </VStack>
            <Tabs value="ALLE" className="mb-4 grow pt-4">
                <TabsList>
                    <TabsTab value="ALLE" label="Saker" />
                    <TabsTab value="MINE" label="Mine saker" />
                    <TabsTab value="BEHANDLET" label="Behandlet" />
                </TabsList>
                <TabsPanel value="ALLE">
                    <OppgaveTabellSkeleton />
                </TabsPanel>
                <TabsPanel value="MINE">
                    <OppgaveTabellSkeleton />
                </TabsPanel>
                <TabsPanel value="BEHANDLET">
                    <OppgaveTabellSkeleton />
                </TabsPanel>
            </Tabs>
        </HStack>
    )
}

function OppgaveTabellSkeleton(): ReactElement {
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
                <OppgaveRowSkeleton />
                <OppgaveRowSkeleton />
                <OppgaveRowSkeleton />
                <OppgaveRowSkeleton />
                <OppgaveRowSkeleton />
                <OppgaveRowSkeleton />
            </TableBody>
        </Table>
    )
}

function OppgaveRowSkeleton(): ReactElement {
    return (
        <TableRow className="hover:bg-gray-50 cursor-pointer">
            <TableDataCell>
                <Skeleton width={226} height={30} />
            </TableDataCell>
            <TableDataCell>
                <Skeleton width={210} height={30} />
            </TableDataCell>
            <TableDataCell>
                <Skeleton width={180} height={30} />
            </TableDataCell>
            <TableDataCell>
                <Skeleton width={180} height={30} />
            </TableDataCell>
            <TableDataCell>
                <Skeleton width={180} height={30} />
            </TableDataCell>
        </TableRow>
    )
}
