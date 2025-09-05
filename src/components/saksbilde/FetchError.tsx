import { ReactElement } from 'react'
import { Alert, BodyShort, Button, HStack } from '@navikt/ds-react'

interface FetchErrorProps {
    refetch: () => void
    message: string
}

export function FetchError({ refetch, message }: FetchErrorProps): ReactElement {
    return (
        <Alert variant="error">
            <HStack gap="4">
                <BodyShort>{message}</BodyShort>
                <Button type="button" size="xsmall" variant="secondary-neutral" onClick={refetch}>
                    Prøv igjen
                </Button>
            </HStack>
        </Alert>
    )
}
