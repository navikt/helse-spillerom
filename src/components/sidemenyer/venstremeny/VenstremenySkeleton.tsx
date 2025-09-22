import { ReactElement } from 'react'
import { HStack, Skeleton, VStack } from '@navikt/ds-react'
import { CalendarIcon } from '@navikt/aksel-icons'

import { Sidemeny } from '@components/sidemenyer/Sidemeny'
import { SkjæringstidspunktIcon } from '@components/ikoner/SkjæringstidspunktIcon'

export function VenstremenySkeleton(): ReactElement {
    return (
        <Sidemeny side="left">
            <VStack gap="4">
                <HStack gap="2">
                    <Skeleton width="40%" height={36} />
                    <Skeleton width="50%" height={36} />
                </HStack>
                <HStack align="center" gap="2">
                    <CalendarIcon aria-hidden fontSize="1.25rem" />
                    <Skeleton width={160} />
                </HStack>
                <HStack align="center" gap="2">
                    <SkjæringstidspunktIcon aria-hidden fontSize="1.25rem" />
                    <Skeleton width={160} />
                </HStack>
                <Skeleton className="my-4" />
                <Skeleton width={200} />
                <Skeleton width={180} height={40} />
            </VStack>
        </Sidemeny>
    )
}
