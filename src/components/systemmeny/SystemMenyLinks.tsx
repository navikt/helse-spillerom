'use client'

import { ReactElement } from 'react'
import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { HStack } from '@navikt/ds-react'
import { DropdownMenuGroupedListItem } from '@navikt/ds-react/Dropdown'

import { useGlobalHandlers } from '@components/tastatursnarveier/useGlobalHandlers'
import { shortcutMetadata } from '@components/tastatursnarveier/shortcutMetadata'

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
                    shortcut={meta.visningssnarvei}
                />
            )
        })
}

interface ExternalLinkButtonProps {
    action: () => void
    tekst: string
    shortcut: string[]
}

const ExternalLinkButton = ({ tekst, action, shortcut }: ExternalLinkButtonProps): ReactElement => (
    <DropdownMenuGroupedListItem key={tekst} as="button" className="px-4 py-2 whitespace-nowrap" onClick={action}>
        {tekst}
        <ExternalLinkIcon fontSize="1.1rem" title="Åpne ekstern lenke" />
        <HStack gap="05" className="ml-auto pl-4 text-medium text-text-subtle">
            {shortcut.map((shortcutKey, index) => (
                <span key={index} className="flex w-4 justify-center">
                    {shortcutKey}
                </span>
            ))}
        </HStack>
    </DropdownMenuGroupedListItem>
)
