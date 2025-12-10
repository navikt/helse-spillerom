import { createContext, useContext } from 'react'

import { Maybe } from '@utils/tsUtils'
import { ParsedRow } from '@components/tidslinje/timeline'

type RowContextType = {
    periods: ParsedRow['periods']
    allPeriods: ParsedRow['periods']
    generasjonPeriodsByLevel: Map<number, ParsedRow['periods']>
    rowIndex: number
}

const RowContext = createContext<Maybe<RowContextType>>(null)
const ExpandedRowsContext = createContext<Maybe<Set<number>>>(null)
const ToggleRowContext = createContext<Maybe<(index: number) => void>>(null)

export function useRowContext(): RowContextType {
    const context = useContext(RowContext)
    if (!context) {
        throw new Error('useRowContext must be used within a RowContext.Provider')
    }
    return context
}

export function useExpandedRows(): Set<number> {
    const context = useContext(ExpandedRowsContext)
    if (!context) {
        throw new Error('useExpandedRows must be used within an ExpandedRowsContext.Provider')
    }
    return context
}

export function useToggleRow(): (index: number) => void {
    const context = useContext(ToggleRowContext)
    if (!context) {
        throw new Error('useToggleRow must be used within a ToggleRowContext.Provider')
    }
    return context
}

export { RowContext, ExpandedRowsContext, ToggleRowContext }
