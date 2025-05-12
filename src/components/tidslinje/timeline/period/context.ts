import { createContext, useContext } from 'react'

import { Maybe } from '@utils/tsUtils'

type PeriodContextType = {
    periodId: string
}

export const PeriodContext = createContext<Maybe<PeriodContextType>>(null)

export function usePeriodContext(): PeriodContextType {
    const context = useContext(PeriodContext)
    if (!context) {
        throw new Error('usePeriodContext must be used within a PeriodContext.Provider')
    }
    return context
}
