import { ReactElement } from 'react'
import { ActionMenu } from '@navikt/ds-react'
import { MenuGridIcon } from '@navikt/aksel-icons'
import { InternalHeaderButton } from '@navikt/ds-react/InternalHeader'
import { ActionMenuContent, ActionMenuGroup, ActionMenuTrigger } from '@navikt/ds-react/ActionMenu'

import { SystemMenyLinks } from '@components/header/systemmeny/SystemMenyLinks'

export function SystemMeny(): ReactElement {
    return (
        <ActionMenu>
            <ActionMenuTrigger>
                <InternalHeaderButton>
                    <MenuGridIcon title="Systemer og oppslagsverk" fontSize="2.25rem" />
                </InternalHeaderButton>
            </ActionMenuTrigger>
            <ActionMenuContent>
                <ActionMenuGroup label="Systemer og oppslagsverk">
                    <SystemMenyLinks />
                </ActionMenuGroup>
            </ActionMenuContent>
        </ActionMenu>
    )
}
