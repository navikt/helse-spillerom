'use client'

import { createContext, PropsWithChildren, ReactElement, useContext, useState } from 'react'
import dayjs from 'dayjs'

import { Inntektsmelding } from '@schemas/inntektsmelding'
import { Søknad } from '@schemas/søknad'
import { Maybe } from '@utils/tsUtils'

export type DokumentSomKanVisesISidebar = Inntektsmelding | Søknad

export type DokumentState = {
    isSelected: boolean
    showSelectButton: boolean
}

type DokumentVisningContextType = {
    dokumenter: DokumentSomKanVisesISidebar[]
    updateDokumenter: (dokument: DokumentSomKanVisesISidebar) => void
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

export function getDokumentId(dokument: DokumentSomKanVisesISidebar): string {
    if ('inntektsmeldingId' in dokument) {
        return dokument.inntektsmeldingId
    }
    return dokument.id
}

export function getMottattDato(dokument: DokumentSomKanVisesISidebar): string {
    if ('mottattDato' in dokument) {
        return dokument.mottattDato
    }
    return dokument.opprettet
}

export function DokumentVisningProvider({ children }: PropsWithChildren): ReactElement {
    const [dokumenter, setDokumenter] = useState<DokumentSomKanVisesISidebar[]>([])
    const [dokumentStateMap, setDokumentStateMap] = useState<Record<string, DokumentState>>({})

    function updateDokumenter(dokument: DokumentSomKanVisesISidebar) {
        const id = getDokumentId(dokument)
        setDokumenter((prev) => {
            const exists = prev.some((d) => getDokumentId(d) === id)
            const newList = exists ? prev.filter((d) => getDokumentId(d) !== id) : [...prev, dokument]

            return newList.sort((a, b) => dayjs(getMottattDato(b)).diff(dayjs(getMottattDato(a))))
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
