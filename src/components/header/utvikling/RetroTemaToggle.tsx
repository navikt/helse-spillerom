'use client'

import { ReactElement, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Tooltip } from '@navikt/ds-react'
import { InternalHeaderButton } from '@navikt/ds-react/InternalHeader'
import { CodeIcon } from '@navikt/aksel-icons'

export function RetroTemaToggle(): ReactElement {
    const [wantsRetroTema, setWantsRetroTema] = useState(false)
    const { theme, setTheme } = useTheme()

    const isRetroTema = theme === 'dark' && wantsRetroTema

    useEffect(() => {
        document.documentElement.classList.toggle('retro-tema', isRetroTema)
    }, [isRetroTema])

    const handleRetroToggle = () => {
        if (theme !== 'dark' && !wantsRetroTema) {
            setTheme('dark')
            setWantsRetroTema(true)
        } else {
            setWantsRetroTema(!wantsRetroTema)
        }
    }

    return (
        <Tooltip content="Toggle retro tema">
            <InternalHeaderButton
                onClick={handleRetroToggle}
                aria-label="Toggle retro tema"
                className={isRetroTema ? 'bg-purple-600 text-white border-purple-600' : ''}
            >
                <CodeIcon aria-hidden fontSize="1.5rem" />
            </InternalHeaderButton>
        </Tooltip>
    )
}
