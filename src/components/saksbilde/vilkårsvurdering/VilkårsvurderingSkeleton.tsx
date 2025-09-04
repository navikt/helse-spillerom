import { ReactElement } from 'react'
import { Accordion, HStack, Skeleton, Table } from '@navikt/ds-react'
import { AccordionContent, AccordionHeader, AccordionItem } from '@navikt/ds-react/Accordion'
import {
    TableBody,
    TableDataCell,
    TableExpandableRow,
    TableHeader,
    TableHeaderCell,
    TableRow,
} from '@navikt/ds-react/Table'

export function VilkårsvurderingSkeleton(): ReactElement {
    return (
        <Accordion size="small" headingSize="xsmall" indent={false}>
            <AccordionItem defaultOpen>
                <AccordionHeader>
                    <Skeleton variant="text" width={240} />
                </AccordionHeader>
                <AccordionContent className="p-0">
                    <HStack wrap={false}>
                        <Table size="medium">
                            <TableHeader>
                                <TableRow>
                                    <TableHeaderCell>Vilkår</TableHeaderCell>
                                    <TableHeaderCell className="min-w-[12rem] whitespace-nowrap">
                                        Status
                                    </TableHeaderCell>
                                    <TableHeaderCell />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRowSkeleton />
                                <TableRowSkeleton />
                                <TableRowSkeleton />
                                <TableRowSkeleton />
                                <TableRowSkeleton />
                                <TableRowSkeleton />
                                <TableRowSkeleton />
                                <TableRowSkeleton />
                                <TableRowSkeleton />
                                <TableRowSkeleton />
                                <TableRowSkeleton />
                            </TableBody>
                        </Table>
                    </HStack>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

function TableRowSkeleton(): ReactElement {
    return (
        <TableExpandableRow content={null} togglePlacement="right">
            <TableDataCell align="center" className="pl-[13px]">
                <HStack wrap={false} gap="4">
                    <Skeleton variant="circle" width={24} />
                    <Skeleton width={360} />
                </HStack>
            </TableDataCell>
            <TableDataCell className="whitespace-nowrap">
                <Skeleton width={124} />
            </TableDataCell>
        </TableExpandableRow>
    )
}
