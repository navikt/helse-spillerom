import { ReactElement } from 'react'
import { Dropdown } from '@navikt/ds-react'
import {
    DropdownMenu,
    DropdownMenuGroupedList,
    DropdownMenuGroupedListHeading,
    DropdownToggle,
} from '@navikt/ds-react/Dropdown'
import { MenuGridIcon } from '@navikt/aksel-icons'
import { InternalHeaderButton } from '@navikt/ds-react/InternalHeader'

import { SystemMenyLinks } from '@components/systemmeny/SystemMenyLinks'

export function SystemMeny(): ReactElement {
    return (
        <Dropdown>
            <InternalHeaderButton as={DropdownToggle}>
                <MenuGridIcon title="Systemer og oppslagsverk" fontSize="2.25rem" />
            </InternalHeaderButton>
            <DropdownMenu className="w-max">
                <DropdownMenuGroupedList>
                    <DropdownMenuGroupedListHeading>Systemer og oppslagsverk</DropdownMenuGroupedListHeading>
                    <SystemMenyLinks />
                </DropdownMenuGroupedList>
            </DropdownMenu>
        </Dropdown>
    )
}
