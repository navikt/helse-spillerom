'use client'

import { ReactElement } from 'react'
import { Button, Heading, Table } from '@navikt/ds-react'
import { usePathname, useRouter } from 'next/navigation'
import { TableDataCell, TableHeaderCell } from '@navikt/ds-react/Table'

import { useBehandlinger } from '@hooks/queries/useBehandlinger'

export default function Page(): ReactElement {
    const { data: behandlinger } = useBehandlinger()
    const router = useRouter()
    const pathname = usePathname()

    const harBehandlinger = behandlinger && behandlinger?.length > 0
    return (
        <div className="p-16">
            <Button
                className="mb-8"
                variant="secondary-neutral"
                onClick={() => router.push(pathname + '/opprett-behandling')}
            >
                Start ny behandling
            </Button>

            {harBehandlinger && (
                <>
                    <Heading spacing size="small">
                        Manuelle behandlinger
                    </Heading>
                    <Table size="small">
                        <Table.Header>
                            <Table.Row>
                                <TableHeaderCell>Fra</TableHeaderCell>
                                <TableHeaderCell>Til</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {behandlinger?.map((behandling) => (
                                <Table.Row
                                    className="cursor-pointer hover:bg-navds-grey-10"
                                    key={behandling.id}
                                    onClick={() =>
                                        router.push(pathname + '/behandling/' + behandling.id + '/vilkarsvurdering')
                                    }
                                >
                                    <TableDataCell>{behandling.fom}</TableDataCell>
                                    <TableDataCell>{behandling.tom}</TableDataCell>
                                    <TableDataCell>✍️</TableDataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </>
            )}
        </div>
    )
}
