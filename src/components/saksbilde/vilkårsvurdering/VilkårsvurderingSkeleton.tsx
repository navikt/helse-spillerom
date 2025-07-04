import { ReactElement } from 'react'
import { Accordion, HStack, Skeleton, Table, VStack } from '@navikt/ds-react'
import { AccordionContent, AccordionHeader, AccordionItem } from '@navikt/ds-react/Accordion'
import { TableBody, TableDataCell, TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table'

import { SaksbildePanel } from '@components/saksbilde/SaksbildePanel'
import { cn } from '@utils/tw'

export function VilkårsvurderingSkeleton(): ReactElement {
    return (
        <SaksbildePanel value="vilkårsvurdering">
            <Accordion size="small" headingSize="xsmall" indent={false}>
                <AccordionItem defaultOpen>
                    <AccordionHeader>
                        <Skeleton variant="text" width={240} />
                    </AccordionHeader>
                    <AccordionContent className="p-0">
                        <HStack wrap={false}>
                            <Table size="medium" className="h-fit w-3/5 min-w-3/5">
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell className="w-full">Vilkår</TableHeaderCell>
                                        <TableHeaderCell className="min-w-[12rem] whitespace-nowrap">
                                            Status
                                        </TableHeaderCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRowSkeleton selected />
                                    <TableRowSkeleton />
                                    <TableRowSkeleton />
                                    <TableRowSkeleton />
                                    <TableRowSkeleton />
                                    <TableRowSkeleton />
                                </TableBody>
                            </Table>
                            <VStack
                                className="bg-surface-selected mt-12 -ml-px grow border-t-2 border-l border-ax-border-neutral px-4 py-3"
                                gap="8"
                            >
                                <HStack wrap={false} gap="4" align="center">
                                    <Skeleton variant="rectangle" width={24} height={24} />
                                    <Skeleton className="grow" />
                                </HStack>
                                <VStack className="px-10" gap="8">
                                    <VStack>
                                        <Skeleton width={150} />
                                        <Skeleton width={70} />
                                        <Skeleton width={70} />
                                        <Skeleton width={170} />
                                    </VStack>
                                    <VStack gap="4">
                                        <VStack>
                                            <Skeleton width={120} />
                                            <Skeleton className="grow" />
                                            <Skeleton variant="rectangle" height={120} />
                                        </VStack>
                                        <HStack gap="3">
                                            <Skeleton variant="rectangle" width={72} height={30} />
                                            <Skeleton variant="rectangle" width={72} height={30} />
                                        </HStack>
                                    </VStack>
                                </VStack>
                            </VStack>
                        </HStack>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader>
                        <Skeleton variant="text" width={240} className="text-2xl" />
                    </AccordionHeader>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader>
                        <Skeleton variant="text" width={240} className="text-2xl" />
                    </AccordionHeader>
                </AccordionItem>
            </Accordion>
        </SaksbildePanel>
    )
}

function TableRowSkeleton({ selected }: { selected?: boolean }): ReactElement {
    return (
        <TableRow selected={selected} className={cn({ 'relative z-10': selected })}>
            <TableDataCell align="center" className="pl-[13px]">
                <HStack wrap={false} gap="4">
                    <Skeleton variant="rectangle" width={24} />
                    <Skeleton width={80} />
                    <Skeleton className="grow" />
                </HStack>
            </TableDataCell>
            <TableDataCell className="whitespace-nowrap">
                <Skeleton width={124} />
            </TableDataCell>
        </TableRow>
    )
}
