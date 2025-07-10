'use client'

import React, { createContext, useContext, useState, ReactElement, PropsWithChildren, useEffect } from 'react'
import { Alert } from '@navikt/ds-react'

interface ToastContextType {
    visToast: (melding: string, variant?: 'success' | 'error' | 'warning' | 'info') => void
    skjulToast: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast(): ToastContextType {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast må brukes innenfor ToastProvider')
    }
    return context
}

interface ToastState {
    melding: string
    variant: 'success' | 'error' | 'warning' | 'info'
    åpen: boolean
}

export function ToastProvider({ children }: PropsWithChildren): ReactElement {
    const [toast, setToast] = useState<ToastState>({
        melding: '',
        variant: 'success',
        åpen: false,
    })

    const visToast = (melding: string, variant: 'success' | 'error' | 'warning' | 'info' = 'success') => {
        setToast({
            melding,
            variant,
            åpen: true,
        })
    }

    const skjulToast = () => {
        setToast((prev) => ({
            ...prev,
            åpen: false,
        }))
    }

    // Automatisk lukk toast etter 5 sekunder
    useEffect(() => {
        if (toast.åpen) {
            const timer = setTimeout(() => {
                skjulToast()
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [toast.åpen])

    return (
        <ToastContext.Provider value={{ visToast, skjulToast }}>
            {children}
            {/* Toast container - sentrert nederst på siden */}
            {toast.åpen && (
                <div className="fixed bottom-8 left-1/2 z-50 w-96 -translate-x-1/2 transform">
                    <Alert variant={toast.variant} closeButton onClose={skjulToast}>
                        {toast.melding}
                    </Alert>
                </div>
            )}
        </ToastContext.Provider>
    )
}
