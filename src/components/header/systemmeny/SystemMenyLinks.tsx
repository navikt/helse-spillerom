'use client'

import React, { ReactElement } from 'react'
import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { ActionMenuItem } from '@navikt/ds-react/ActionMenu'

import { useGlobalHandlers } from '@components/tastatursnarveier/useGlobalHandlers'
import { keyCodeLabel, modifierLabels, shortcutMetadata } from '@components/tastatursnarveier/shortcutMetadata'

export function SystemMenyLinks(): ReactElement[] {
    const { externalLinks } = useGlobalHandlers()

    return shortcutMetadata
        .filter((meta) => meta.id in externalLinks)
        .map((meta) => {
            const { id, key, modifier, externalLinkTekst } = meta
            return (
                <ActionMenuItem
                    key={id}
                    onSelect={externalLinks[id]!}
                    icon={<ExternalLinkIcon aria-hidden />}
                    shortcut={modifier ? `${modifierLabels[modifier]}+${keyCodeLabel(key)}` : keyCodeLabel(key)}
                >
                    {externalLinkTekst}
                </ActionMenuItem>
            )
        })
}
