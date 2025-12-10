import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react'
import { ReactElement } from 'react'
import { useRouter } from 'next/navigation'

import { usePersonRouteParams } from '@hooks/useRouteParams'

interface NavnOgAlderProps {
    navn: string
    alder: number
}

export function NavnOgAlder({ navn, alder }: NavnOgAlderProps): ReactElement {
    const router = useRouter()
    const { pseudoId } = usePersonRouteParams()

    return (
        <HStack gap="1" align="center">
            <BodyShort
                weight="semibold"
                className="cursor-pointer hover:underline"
                onClick={() => router.push(`/person/${pseudoId}`)}
            >
                {navn} ({alder} år)
            </BodyShort>
            <Tooltip content="Kopier navn">
                <CopyButton copyText={navn} size="xsmall" />
            </Tooltip>
        </HStack>
    )
}
