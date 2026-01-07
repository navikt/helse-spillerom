'use client'

import React, { ReactElement } from 'react'
import { useTheme } from 'next-themes'
import { MoonIcon, SunIcon } from '@navikt/aksel-icons'
import { ActionMenuItem } from '@navikt/ds-react/ActionMenu'

export function DarkModeToggle(): ReactElement {
    const { theme, setTheme } = useTheme()

    const isDark = theme === 'dark'

    return (
        <ActionMenuItem
            onSelect={() => setTheme(isDark ? 'light' : 'dark')}
            icon={isDark ? <SunIcon aria-hidden /> : <MoonIcon aria-hidden />}
        >
            {isDark ? 'Lys modus' : 'Mørk modus'}
        </ActionMenuItem>
    )
}
