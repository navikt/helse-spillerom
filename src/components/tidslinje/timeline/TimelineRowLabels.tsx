import React, { ReactElement } from 'react'
import { BodyShort, HStack, VStack } from '@navikt/ds-react'
import { BriefcaseIcon, TasklistIcon, WalletIcon } from '@navikt/aksel-icons'

interface TimelineRowLabelsProps {
    labels: string[]
}

export function TimelineRowLabels({ labels }: TimelineRowLabelsProps): ReactElement {
    // Hardkodet for demo: Tilkommen inntekt-navn har ofte typisk mønster/navn, prod: send inn en mapping eller flagg!
    const isTilkommenInntekt = (label: string) =>
        label.toLowerCase().includes('tilkommen') ||
        label.toLowerCase().includes('snill') ||
        label.toLowerCase().includes('jervproffen')

    return (
        <VStack className="w-[254px] min-w-[254px]">
            <div className="h-[20px]" />
            {labels.map((label, index) => (
                <HStack key={index} className="my-4 h-[24px]" gap="2" wrap={false}>
                    {index === 0 ? (
                        <TasklistIcon aria-hidden fontSize="1.5rem" />
                    ) : isTilkommenInntekt(label) ? (
                        <WalletIcon aria-hidden fontSize="1.5rem" className="text-ax-icon-accent" />
                    ) : (
                        <BriefcaseIcon aria-hidden fontSize="1.5rem" />
                    )}
                    <BodyShort>{label}</BodyShort>
                </HStack>
            ))}
        </VStack>
    )
}
