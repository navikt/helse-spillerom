'use client'

import { Table } from '@navikt/ds-react'
import { ReactElement } from 'react'

export function VilkårsvurderingDebug(): ReactElement {
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Kode</Table.HeaderCell>
                    <Table.HeaderCell>Vurdering</Table.HeaderCell>
                    <Table.HeaderCell>Årsaker</Table.HeaderCell>
                    <Table.HeaderCell>Notat</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body></Table.Body>
        </Table>
    )
}
