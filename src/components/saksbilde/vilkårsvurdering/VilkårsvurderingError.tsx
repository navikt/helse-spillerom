import { ReactElement } from 'react'
import { BodyShort, Button, HStack } from '@navikt/ds-react'

export function VilkårsvurderingError({ refetch }: { refetch: () => void }): ReactElement {
    return (
        <HStack gap="4">
            <BodyShort>Klarte ikke hente vilkårsvurdering akkurat nå.</BodyShort>
            <Button type="button" size="xsmall" variant="secondary" onClick={refetch}>
                Prøv igjen
            </Button>
        </HStack>
    )
}
