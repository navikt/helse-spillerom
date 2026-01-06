import React, { ReactElement } from 'react'
import { BodyShort, CopyButton, HStack, Tooltip, VStack } from '@navikt/ds-react'
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
        <VStack className="-ml-2 w-[254px] min-w-[254px]">
            <div className="h-[20px]" />
            {labels.map((label) => {
                const isExpandable = label.generationLevels > 0
                const isExpanded = expandedRows.has(label.rowIndex)
                const expandedExtraHeight = isExpanded ? label.generationLevels * 32 : 0

                return (
                    <HStack
                        key={label.rowIndex}
                        gap="1"
                        wrap={false}
                        align="start"
                        className="my-4"
                        style={{ height: `${24 + expandedExtraHeight}px` }}
                    >
                        <HStack
                            as={isExpandable ? 'button' : 'div'}
                            role={isExpandable ? 'button' : undefined}
                            onClick={isExpandable ? () => toggleRowExpanded(label.rowIndex) : undefined}
                            aria-expanded={isExpandable ? isExpanded : undefined}
                            className={cn('h-6', {
                                'group cursor-pointer text-ax-text-accent-subtle': isExpandable,
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
                            <Tooltip content={label.label} describesChild>
                                <BodyShort
                                    data-sensitive
                                    size="small"
                                    className="max-w-[168px] leading-6 group-hover:underline"
                                    truncate
                                >
                                    {label.label}
                                </BodyShort>
                            </Tooltip>
                        </HStack>
                        {label.copyLabelButton && (
                            <Tooltip content="Kopier arbeidsgivernavn">
                                <CopyButton copyText={label.label} size="xsmall" />
                            </Tooltip>
                        )}
                    </HStack>
                )
            })}
        </VStack>
    )
}
