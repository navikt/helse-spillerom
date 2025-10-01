'use client'

import { ReactElement, ReactNode, Component, ErrorInfo } from 'react'
import { Alert, BodyShort, Button, HStack, VStack } from '@navikt/ds-react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { useState } from 'react'
import { ZodError } from 'zod/v4'

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: (error: Error, errorInfo: ErrorInfo) => ReactElement
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        })
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })
    }

    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.state.errorInfo!)
            }

            return <ErrorDisplay error={this.state.error} errorInfo={this.state.errorInfo} onReset={this.handleReset} />
        }

        return this.props.children
    }
}

interface ErrorDisplayProps {
    error: Error
    errorInfo: ErrorInfo | null
    onReset: () => void
}

function ErrorDisplay({ error, errorInfo, onReset }: ErrorDisplayProps): ReactElement {
    const [showDetails, setShowDetails] = useState(false)

    const isZodError = error instanceof ZodError
    const isZodParsingError = error.message === 'Invalid response format from server'
    const zodErrorFromCause = error.cause instanceof ZodError

    const getErrorMessage = () => {
        if (isZodError || isZodParsingError || zodErrorFromCause) {
            return 'Det oppstod en feil ved validering av data fra serveren. Dette kan skyldes endringer i API-et eller uventet dataformat.'
        }
        return error.message || 'En uventet feil oppstod'
    }

    const getErrorDetails = () => {
        const details: Record<string, unknown> = {
            message: error.message,
            name: error.name,
            stack: error.stack,
        }

        if (isZodError) {
            details.zodIssues = error.issues
        } else if (zodErrorFromCause && error.cause instanceof ZodError) {
            details.zodIssues = error.cause.issues
            details.originalZodError = {
                message: error.cause.message,
                name: error.cause.name,
            }
        }

        if (errorInfo) {
            details.componentStack = errorInfo.componentStack
        }

        return details
    }

    return (
        <Alert variant="error" className="m-4">
            <VStack gap="4">
                <BodyShort>{getErrorMessage()}</BodyShort>

                <HStack gap="2">
                    <Button size="small" variant="secondary" onClick={onReset}>
                        Prøv igjen
                    </Button>
                    <Button
                        size="small"
                        variant="tertiary"
                        onClick={() => setShowDetails(!showDetails)}
                        icon={showDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    >
                        {showDetails ? 'Skjul' : 'Vis'} detaljer
                    </Button>
                </HStack>

                {showDetails && (
                    <div className="mt-4">
                        <BodyShort className="mb-2 font-semibold">Feildetaljer:</BodyShort>
                        <pre className="bg-gray-50 max-h-96 overflow-auto rounded border p-4 text-xs">
                            {JSON.stringify(getErrorDetails(), null, 2)}
                        </pre>
                    </div>
                )}
            </VStack>
        </Alert>
    )
}
