import React, { ReactElement } from 'react'
import { BodyShort, HStack, VStack } from '@navikt/ds-react'
import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons'

import { RowLabels } from '@components/tidslinje/timeline/index'
import { cn } from '@utils/tw'
import { useExpandedRows, useToggleRow } from '@components/tidslinje/timeline/row/context'

interface TimelineRowLabelsProps {
    labels: RowLabels
}

export function TimelineRowLabels({ labels }: TimelineRowLabelsProps): ReactElement {
    const expandedRows = useExpandedRows()
    const toggleRowExpanded = useToggleRow()

    return (
        <VStack className="w-[254px] min-w-[254px]">
            <div className="h-[20px]" />
            {labels.map((label) => {
                const isExpandable = label.generationLevels > 0
                const isExpanded = expandedRows.has(label.rowIndex)
                const expandedExtraHeight = isExpanded ? label.generationLevels * 32 : 0

                return (
                    <div key={label.rowIndex} className="my-4" style={{ height: `${24 + expandedExtraHeight}px` }}>
                        <HStack
                            as={isExpandable ? 'button' : 'div'}
                            role={isExpandable ? 'button' : undefined}
                            onClick={isExpandable ? () => toggleRowExpanded(label.rowIndex) : undefined}
                            aria-expanded={isExpandable ? isExpanded : undefined}
                            className={cn('h-6', {
                                'cursor-pointer text-ax-text-accent-subtle group': isExpandable,
                            })}
                            gap="2"
                            wrap={false}
                            align="start"
                        >
                            {isExpandable ? (
                                isExpanded ? (
                                    <ChevronDownIcon className="-mr-1" fontSize="1.5rem" />
                                ) : (
                                    <ChevronRightIcon className="-mr-1" fontSize="1.5rem" />
                                )
                            ) : (
                                <div className="w-5" />
                            )}
                            {label.icon}
                            <BodyShort className="group-hover:underline">{label.label}</BodyShort>
                        </HStack>
                    </div>
                )
            })}
        </VStack>
    )
}
