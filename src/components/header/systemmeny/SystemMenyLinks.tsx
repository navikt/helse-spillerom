'use client'

import React, { ReactElement } from 'react'
import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { Spacer } from '@navikt/ds-react'
import { DropdownMenuGroupedListItem } from '@navikt/ds-react/Dropdown'

import { useGlobalHandlers } from '@components/tastatursnarveier/useGlobalHandlers'
import { KeyCode, ModifierKey, shortcutMetadata } from '@components/tastatursnarveier/shortcutMetadata'
import { Shortcut } from '@components/header/Shortcut'

export function SystemMenyLinks(): ReactElement[] {
    const { externalLinks } = useGlobalHandlers()

    return shortcutMetadata
        .filter((meta) => meta.id in externalLinks)
        .map((meta) => {
            return (
                <ExternalLinkButton
                    key={meta.id}
                    tekst={meta.externalLinkTekst ?? meta.id}
                    action={externalLinks[meta.id]!}
                    keyCode={meta.key}
                    modifier={meta.modifier}
                />
            )
        })
}

interface ExternalLinkButtonProps {
    action: () => void
    tekst: string
    keyCode: KeyCode
    modifier?: ModifierKey
}

const ExternalLinkButton = ({ tekst, action, keyCode, modifier }: ExternalLinkButtonProps): ReactElement => (
    <DropdownMenuGroupedListItem key={tekst} as="button" className="whitespace-nowrap px-4 py-2" onClick={action}>
        {tekst}
        <ExternalLinkIcon fontSize="1.1rem" title="Åpne ekstern lenke" />
        <Spacer />
        <Shortcut keyCode={keyCode} modifier={modifier} />
    </DropdownMenuGroupedListItem>
)
