'use client'

import { type PropsWithChildren, type ReactElement } from 'react'

import { erLokalEllerDemo } from '@/env'
import { useBrukerinfo } from '@/hooks/queries/useBrukerinfo'
import { Skeleton } from '@navikt/ds-react'

export function MockSessionProvider({ children }: PropsWithChildren): ReactElement {
    // Bruk useBrukerinfo hook for å initialisere session og få caching
    const { isLoading, error } = useBrukerinfo()

    // Kun render children når session er initialisert (eller ikke mock API)

    if (erLokalEllerDemo && (isLoading || error)) {
        return <div style={{ height: '100vh', width: '100vw' }}>
            <Skeleton variant="rectangle" className='h-full w-full' />
        </div>
    }


    return <>{children}</>
}
