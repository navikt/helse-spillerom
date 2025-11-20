'use client'

import {
    createContext,
    Dispatch,
    PropsWithChildren,
    ReactElement,
    SetStateAction,
    useCallback,
    useContext,
    useState,
} from 'react'
import dayjs from 'dayjs'

import { Inntektsmelding } from '@schemas/inntektsmelding'
import { Maybe } from '@utils/tsUtils'

export type SelectHandler = {
    active: boolean
    handler: () => void
}

type DokumentVisningContextType = {
    dokumenter: Inntektsmelding[]
    setDokumenter: Dispatch<SetStateAction<Inntektsmelding[]>>
    selectHandlerMap?: Record<string, SelectHandler>
    setSelectHandlerMap: Dispatch<SetStateAction<Record<string, SelectHandler> | undefined>>
}

export const deactivateHandlers = (map: Record<string, SelectHandler>) =>
    Object.fromEntries(Object.entries(map).map(([k, v]) => [k, { ...v, active: false }]))

export const activateHandlersForIds = (ids: string[], map: Record<string, SelectHandler>) =>
    Object.fromEntries(Object.entries(map).map(([k, v]) => [k, ids.includes(k) ? { ...v, active: true } : v]))

export const DokumentVisningContext = createContext<Maybe<DokumentVisningContextType>>(null)

export function useDokumentVisningContext(): DokumentVisningContextType {
    const context = useContext(DokumentVisningContext)
    if (!context) {
        throw new Error('useDokumentVisningContext must be used within a RowContext.Provider')
    }
    return context
}

export function DokumentVisningProvider({ children }: PropsWithChildren): ReactElement {
    const [dokumenter, setDokumenterInternal] = useState<Inntektsmelding[]>([])
    const [selectHandlerMap, setSelectHandlerMap] = useState<Record<string, SelectHandler> | undefined>(undefined)

    const setDokumenter = useCallback(
        (update: Inntektsmelding[] | ((prev: Inntektsmelding[]) => Inntektsmelding[])) => {
            setDokumenterInternal((prev) => {
                const newDokumenter = typeof update === 'function' ? update(prev) : update
                return [...newDokumenter].sort((a, b) => dayjs(b.mottattDato).diff(dayjs(a.mottattDato)))
            })
        },
        [],
    )

    return (
        <DokumentVisningContext.Provider value={{ dokumenter, setDokumenter, selectHandlerMap, setSelectHandlerMap }}>
            {children}
        </DokumentVisningContext.Provider>
    )
}
