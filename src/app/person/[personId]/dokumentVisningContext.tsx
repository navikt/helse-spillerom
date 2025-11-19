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

type DokumentVisningContextType = {
    dokumenter: Inntektsmelding[]
    setDokumenter: Dispatch<SetStateAction<Inntektsmelding[]>>
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
        <DokumentVisningContext.Provider value={{ dokumenter, setDokumenter }}>
            {children}
        </DokumentVisningContext.Provider>
    )
}
