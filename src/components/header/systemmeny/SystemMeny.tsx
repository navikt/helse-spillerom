import { ReactElement } from 'react'
import { ActionMenu, Tooltip } from '@navikt/ds-react'
import { MenuGridIcon } from '@navikt/aksel-icons'
import { InternalHeaderButton } from '@navikt/ds-react/InternalHeader'
import { ActionMenuContent, ActionMenuGroup, ActionMenuTrigger } from '@navikt/ds-react/ActionMenu'

import { SystemMenyLinks } from '@components/header/systemmeny/SystemMenyLinks'

export function SystemMeny(): ReactElement {
    return (
        <ActionMenu>
            <Tooltip content="Systemer og oppslagsverk">
                <ActionMenuTrigger>
                    <InternalHeaderButton aria-label="Åpne systemer- og oppslagsverkmeny">
                        <MenuGridIcon aria-hidden fontSize="2.25rem" />
                    </InternalHeaderButton>
                </ActionMenuTrigger>
            </Tooltip>
            <ActionMenuContent>
                <ActionMenuGroup label="Systemer og oppslagsverk">
                    <SystemMenyLinks />
                </ActionMenuGroup>
            </ActionMenuContent>
        </ActionMenu>
    )
}
