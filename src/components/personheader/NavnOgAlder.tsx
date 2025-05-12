import { BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react'
import { ReactElement } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface NavnOgAlderProps {
    navn: string
    alder: number
}

export function NavnOgAlder({ navn, alder }: NavnOgAlderProps): ReactElement {
    const router = useRouter()
    const params = useParams()

    return (
        <HStack gap="1" align="center">
            <BodyShort 
                weight="semibold" 
                className="cursor-pointer hover:underline"
                onClick={() => router.push(`/person/${params.personId}`)}
            >
                {navn} ({alder} år)
            </BodyShort>
            <Tooltip content="Kopier navn">
                <CopyButton copyText={navn} size="xsmall" />
            </Tooltip>
        </HStack>
    )
}
