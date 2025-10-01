'use client'

import { ReactElement, useEffect, useState } from 'react'
import { Alert, BodyShort, Button, VStack, ReadMore } from '@navikt/ds-react'
import { Query, useQueryClient } from '@tanstack/react-query'

export function QueryErrors(): ReactElement | null {
    const queryClient = useQueryClient()
    const [failedQueries, setFailedQueries] = useState<Query[]>([])

    useEffect(() => {
        const updateFailedQueries = () => {
            // Hent alle queries fra query client
            const queries = queryClient.getQueryCache().getAll()
            // Filtrer ut kun feilede queries
            const failed = queries.filter((query) => query.state.status === 'error')
            setFailedQueries(failed)
        }

        // Oppdater umiddelbart
        updateFailedQueries()

        // Sett opp polling hvert 5. sekund
        const interval = setInterval(updateFailedQueries, 5000)

        return () => clearInterval(interval)
    }, [queryClient])

    if (failedQueries.length === 0) {
        return null
    }

    const handleRetryAll = () => {
        failedQueries.forEach((query) => {
            queryClient.invalidateQueries({ queryKey: query.queryKey })
        })
    }

    return (
        <div className="m-4">
            <VStack gap="2">
                {failedQueries.map((query, index) => {
                    const error = query.state.error as Error
                    const queryKey = query.queryKey

                    return (
                        <Alert key={`${JSON.stringify(queryKey)}-${index}`} variant="error">
                            <VStack gap="2">
                                <BodyShort>
                                    <strong>Query feilet:</strong> {JSON.stringify(queryKey)}
                                </BodyShort>
                                <ReadMore header="Feilmelding">
                                    <pre> {error?.message || 'Ukjent feil'}</pre>
                                </ReadMore>
                            </VStack>
                        </Alert>
                    )
                })}

                {failedQueries.length > 1 && (
                    <Alert variant="warning">
                        <VStack gap="2">
                            <BodyShort>
                                <strong>{failedQueries.length} queries feilet</strong>
                            </BodyShort>
                            <Button size="small" variant="secondary" onClick={handleRetryAll}>
                                Prøv alle igjen
                            </Button>
                        </VStack>
                    </Alert>
                )}
            </VStack>
        </div>
    )
}
