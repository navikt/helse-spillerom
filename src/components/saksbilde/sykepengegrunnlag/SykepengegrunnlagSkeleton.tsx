import React, { ReactElement } from 'react'
import { Bleed, BodyShort, BoxNew, Heading, HStack, Skeleton, VStack } from '@navikt/ds-react'

export function SykepengegrunnlagSkeleton(): ReactElement {
    return (
        <VStack gap="6" className="max-w-[508px] pr-16">
            <HStack gap="4" align="center">
                <Heading size="small" level="1">
                    Inntekter
                </Heading>
                <Skeleton width={100} height={40} />
            </HStack>
            <VStack gap="3">
                <YrkesaktivitetRad />
                <span className="h-px bg-ax-border-neutral-subtle" />
                <YrkesaktivitetRad />
            </VStack>
            <span className="border-t border-t-ax-bg-neutral-strong" />
            <HStack justify="space-between">
                <BodyShort weight="semibold">Totalt</BodyShort>
                <Skeleton width={100} />
            </HStack>
            <Bleed marginInline="4 32" asChild reflectivePadding>
                <BoxNew background="neutral-soft" className="py-4" borderRadius="large" marginBlock="4 0">
                    <HStack justify="space-between">
                        <BodyShort weight="semibold">Sykepengegrunnlag</BodyShort>
                        <Skeleton width={100} />
                    </HStack>
                </BoxNew>
            </Bleed>
        </VStack>
    )
}

function YrkesaktivitetRad(): ReactElement {
    return (
        <HStack justify="space-between">
            <HStack gap="4">
                <Skeleton variant="rectangle" height={24} width={24} />
                <Skeleton width={160} />
            </HStack>
            <Skeleton width={100} />
        </HStack>
    )
}
