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
    selected: boolean
    show: boolean
    handler: () => void
}

type DokumentVisningContextType = {
    dokumenter: Inntektsmelding[]
    setDokumenter: Dispatch<SetStateAction<Inntektsmelding[]>>
    removeDokument: (id: string) => void
    selectHandlerMap?: Record<string, SelectHandler>
    setSelectHandlerMap: Dispatch<SetStateAction<Record<string, SelectHandler> | undefined>>
    deactivateHandlers: () => void
    activateHandlersForIds: (ids: string[]) => void
}

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

    const removeDokument = useCallback((id: string) => {
        setDokumenterInternal((prev) => prev.filter((d) => d.inntektsmeldingId !== id))
        setSelectHandlerMap((prev) => (prev ? { ...prev, [id]: { ...prev[id], show: false } } : undefined))
    }, [])

    const deactivateHandlers = useCallback(() => {
        setSelectHandlerMap(
            (prev) => prev && Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, { ...v, show: false }])),
        )
    }, [])

    const activateHandlersForIds = useCallback(
        (ids: string[]) =>
            setSelectHandlerMap((prev) =>
                prev
                    ? Object.fromEntries(
                          Object.entries(prev).map(([k, v]) => [k, ids.includes(k) ? { ...v, show: true } : v]),
                      )
                    : prev,
            ),
        [],
    )

    return (
        <DokumentVisningContext.Provider
            value={{
                dokumenter,
                setDokumenter,
                removeDokument,
                selectHandlerMap,
                setSelectHandlerMap,
                deactivateHandlers,
                activateHandlersForIds,
            }}
        >
            {children}
        </DokumentVisningContext.Provider>
    )
}
