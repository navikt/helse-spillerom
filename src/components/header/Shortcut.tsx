import React, { ReactElement } from 'react'
import { HStack } from '@navikt/ds-react'

interface ShortcutProps {
    shortcut: string[]
}

export function Shortcut({ shortcut }: ShortcutProps): ReactElement {
    return (
        <HStack gap="05" className="text-medium text-text-subtle">
            {shortcut.map((key, index) => (
                <span key={index} className="flex w-4 justify-center">
                    {key}
                </span>
            ))}
        </HStack>
    )
}
