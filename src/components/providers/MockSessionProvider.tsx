'use client'

import { type PropsWithChildren, type ReactElement } from 'react'
import { Skeleton } from '@navikt/ds-react'

import { erDevLokalEllerDemo } from '@/env'
import { useBrukerinfo } from '@/hooks/queries/useBrukerinfo'

export function MockSessionProvider({ children }: PropsWithChildren): ReactElement {
    // Bruk useBrukerinfo hook for å initialisere session og få caching
    const { isLoading, error } = useBrukerinfo()

    // Kun render children når session er initialisert (eller ikke mock API)

    if (erDevLokalEllerDemo && (isLoading || error)) {
        return (
            <div style={{ height: '100vh', width: '100vw' }}>
                <Skeleton variant="rectangle" className="h-full w-full" />
            </div>
        )
    }

    return <>{children}</>
}
