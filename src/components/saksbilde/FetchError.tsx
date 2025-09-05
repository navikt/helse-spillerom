import { ReactElement } from 'react'
import { Alert, BodyShort, Button, HStack } from '@navikt/ds-react'

type ErrorWithRefetchProps = {
    refetch: () => void
    message: string
}

export function FetchError({ refetch, message }: ErrorWithRefetchProps): ReactElement {
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
