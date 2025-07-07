'use client'

import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import { Button, Tooltip } from '@navikt/ds-react'
import { CodeIcon } from '@navikt/aksel-icons'
import { useTheme } from 'next-themes'

interface RetroTemaToggleProps {
    className?: string
}

export function RetroTemaToggle({ className }: RetroTemaToggleProps): ReactElement {
    const [isRetroTema, setIsRetroTema] = useState(false)
    const { theme, setTheme } = useTheme()

    const toggleRetroTema = useCallback(() => {
        const newRetroTema = !isRetroTema
        setIsRetroTema(newRetroTema)

        if (newRetroTema) {
            document.documentElement.classList.add('retro-tema')
        } else {
            document.documentElement.classList.remove('retro-tema')
        }
    }, [isRetroTema])

    useEffect(() => {
        if (theme === 'light' && isRetroTema) {
            setIsRetroTema(false)
            toggleRetroTema()
        }
    }, [theme, isRetroTema, setIsRetroTema, toggleRetroTema])

    const handleRetroToggle = () => {
        if (theme !== 'dark' && !isRetroTema) {
            // Første klikk: Skru på darkmode + retro tema
            setTheme('dark')
            toggleRetroTema()
        } else if (theme === 'dark' && isRetroTema) {
            // Andre klikk: Skru av retro tema, la darkmode være på
            toggleRetroTema()
        } else if (theme === 'dark' && !isRetroTema) {
            // Tredje klikk: Skru på retro tema igjen
            toggleRetroTema()
        }
    }

    return (
        <Tooltip content="Toggle retro tema">
            <Button
                type="button"
                onClick={handleRetroToggle}
                icon={<CodeIcon title="Toggle retro tema" aria-hidden />}
                variant="tertiary-neutral"
                size="small"
                className={`${isRetroTema ? 'bg-purple-600 text-white border-purple-600' : ''} ${className || ''}`}
            />
        </Tooltip>
    )
}
