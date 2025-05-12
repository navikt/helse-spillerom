import { createContext, useContext } from 'react'

import { Maybe } from '@utils/tsUtils'
import { ParsedRow } from '@components/tidslinje/timeline'

type RowContextType = {
    periods: ParsedRow['periods']
}

export const RowContext = createContext<Maybe<RowContextType>>(null)

export function useRowContext(): RowContextType {
    const context = useContext(RowContext)
    if (!context) {
        throw new Error('useRowContext must be used within a RowContext.Provider')
    }
    return context
}
