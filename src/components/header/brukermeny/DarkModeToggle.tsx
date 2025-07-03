'use client'

import React, { ReactElement } from 'react'
import { useTheme } from 'next-themes'
import { DropdownMenuList, DropdownMenuListItem } from '@navikt/ds-react/Dropdown'
import { MoonIcon, SunIcon } from '@navikt/aksel-icons'

export function DarkModeToggle(): ReactElement {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    const isDark = theme === 'dark'

    return (
        <DropdownMenuList>
            <DropdownMenuListItem onClick={toggleTheme}>
                {isDark ? (
                    <>
                        <SunIcon aria-hidden fontSize="1.5rem" />
                        Lys modus
                    </>
                ) : (
                    <>
                        <MoonIcon aria-hidden fontSize="1.5rem" />
                        Mørk modus
                    </>
                )}
            </DropdownMenuListItem>
        </DropdownMenuList>
    )
}
