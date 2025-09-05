import { Skeleton, Table, VStack } from '@navikt/ds-react'
import { ReactElement } from 'react'
import {
    TableBody,
    TableDataCell,
    TableExpandableRow,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from '@navikt/ds-react/Table'

export function YrkesaktivitetSkeleton(): ReactElement {
    return (
        <VStack gap="6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell />
                        <TableHeaderCell>Yrkesaktivitet</TableHeaderCell>
                        <TableHeaderCell>Organisasjon</TableHeaderCell>
                        <TableHeaderCell>Sykmeldt</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableExpandableRow content={null}>
                        <TableDataCell>
                            <Skeleton width={140} />
                        </TableDataCell>
                        <TableDataCell>
                            <Skeleton width={140} />
                        </TableDataCell>
                        <TableDataCell>
                            <Skeleton width={140} />
                        </TableDataCell>
                    </TableExpandableRow>
                    <TableExpandableRow content={null}>
                        <TableDataCell>
                            <Skeleton width={140} />
                        </TableDataCell>
                        <TableDataCell>
                            <Skeleton width={140} />
                        </TableDataCell>
                        <TableDataCell>
                            <Skeleton width={140} />
                        </TableDataCell>
                    </TableExpandableRow>
                </TableBody>
            </Table>
            <Skeleton width={200} height={40} />
        </VStack>
    )
}
