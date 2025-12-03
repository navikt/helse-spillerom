'use client'

import { createContext, PropsWithChildren, ReactElement, useContext, useState } from 'react'
import dayjs from 'dayjs'

import { Inntektsmelding } from '@schemas/inntektsmelding'
import { Maybe } from '@utils/tsUtils'

export type DokumentState = {
    isSelected: boolean
    showSelectButton: boolean
}

type DokumentVisningContextType = {
    dokumenter: Inntektsmelding[]
    updateDokumenter: (dokument: Inntektsmelding) => void
    dokumentStateMap: Record<string, DokumentState>
    selectDokument: (id: string) => void
    updateDokumentState: (id: string, changes: Partial<DokumentState>) => void
    hideSelectButtonForAll: () => void
    syncDokumentStateWithForm: (ids: string[], selectedId: string) => void
}

export const DokumentVisningContext = createContext<Maybe<DokumentVisningContextType>>(null)

export function useDokumentVisningContext(): DokumentVisningContextType {
    const context = useContext(DokumentVisningContext)
    if (!context) {
        throw new Error('useDokumentVisningContext must be used within a DokumentVisningProvider')
    }
    return context
}

export function DokumentVisningProvider({ children }: PropsWithChildren): ReactElement {
    const [dokumenter, setDokumenter] = useState<Inntektsmelding[]>([])
    const [dokumentStateMap, setDokumentStateMap] = useState<Record<string, DokumentState>>({})

    function updateDokumenter(dokument: Inntektsmelding) {
        setDokumenter((prev) => {
            const exists = prev.some((d) => d.inntektsmeldingId === dokument.inntektsmeldingId)
            const newList = exists
                ? prev.filter((d) => d.inntektsmeldingId !== dokument.inntektsmeldingId)
                : [...prev, dokument]

            return newList.sort((a, b) => dayjs(b.mottattDato).diff(dayjs(a.mottattDato)))
        })
    }

    function updateDokumentState(id: string, changes: Partial<DokumentState>) {
        setDokumentStateMap((prev) => {
            const current = prev[id]

            // Skip update if nothing changed
            if (
                current &&
                Object.keys(changes).every(
                    (key) => current[key as keyof DokumentState] === changes[key as keyof DokumentState],
                )
            ) {
                return prev
            }

            return {
                ...prev,
                [id]: current ? { ...current, ...changes } : { isSelected: false, showSelectButton: false, ...changes },
            }
        })
    }

    function selectDokument(id: string) {
        setDokumentStateMap((prev) =>
            Object.fromEntries(
                Object.entries({ ...prev, [id]: prev[id] ?? { isSelected: false, showSelectButton: false } }).map(
                    ([k, v]) => [k, { ...v, isSelected: k === id }],
                ),
            ),
        )
    }

    function hideSelectButtonForAll() {
        setDokumentStateMap((prev) =>
            Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, { ...v, showSelectButton: false }])),
        )
    }

    function syncDokumentStateWithForm(ids: string[], selectedId: string) {
        setDokumentStateMap((prev) =>
            Object.fromEntries(
                Object.entries(prev).map(([k, v]) => [
                    k,
                    ids.includes(k)
                        ? { ...v, showSelectButton: true, isSelected: k === selectedId }
                        : { ...v, isSelected: false },
                ]),
            ),
        )
    }

    return (
        <DokumentVisningContext.Provider
            value={{
                dokumenter,
                updateDokumenter,
                dokumentStateMap,
                updateDokumentState,
                selectDokument,
                hideSelectButtonForAll,
                syncDokumentStateWithForm,
            }}
        >
            {children}
        </DokumentVisningContext.Provider>
    )
}
