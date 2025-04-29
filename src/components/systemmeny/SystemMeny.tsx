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

export function SystemMeny(): ReactElement {
    return (
        <Dropdown>
            <InternalHeaderButton as={DropdownToggle} aria-label="Toggle dropdown">
                <MenuGridIcon title="Systemmeny" fontSize="2.25rem" />
            </InternalHeaderButton>
            <DropdownMenu>
                <DropdownMenuGroupedList>
                    <DropdownMenuGroupedListHeading>Systemer og oppslagsverk</DropdownMenuGroupedListHeading>
                    {/*<SystemMenuLinks />*/}
                </DropdownMenuGroupedList>
            </DropdownMenu>
        </Dropdown>
    )
}
