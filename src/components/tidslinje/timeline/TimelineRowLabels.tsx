import React, { ReactElement } from 'react'
import { BodyShort, HStack, VStack } from '@navikt/ds-react'
import { BriefcaseIcon } from '@navikt/aksel-icons'

interface TimelineRowLabelsProps {
    labels: string[]
}

export function TimelineRowLabels({ labels }: TimelineRowLabelsProps): ReactElement {
    return (
        <VStack className="w-[254px] min-w-[254px]">
            <div className="h-[20px]" />
            {labels.map((label, index) => (
                <HStack key={index} className="my-4 h-[24px]" gap="2" wrap={false}>
                    <BriefcaseIcon aria-hidden fontSize="1.5rem" />
                    <BodyShort>{label}</BodyShort>
                </HStack>
            ))}
        </VStack>
    )
}
