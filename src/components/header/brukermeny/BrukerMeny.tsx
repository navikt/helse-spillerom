'use client'

import { BodyShort, Detail, Dropdown, Skeleton, Spacer, HStack } from '@navikt/ds-react'
import { LeaveIcon, PersonPencilIcon, TasklistFillIcon } from '@navikt/aksel-icons'
import React, { ReactElement } from 'react'
import { InternalHeaderUserButton } from '@navikt/ds-react/InternalHeader'
import {
    DropdownMenu,
    DropdownMenuDivider,
    DropdownMenuList,
    DropdownMenuListItem,
    DropdownToggle,
} from '@navikt/ds-react/Dropdown'

import { useBrukerRoller } from '@hooks/queries/useBrukerRoller'
import { Tastatursnarveier } from '@components/header/brukermeny/Tastatursnarveier'
import { DarkModeToggle } from '@components/header/brukermeny/DarkModeToggle'
import { useBrukerinfo } from '@hooks/queries/useBrukerinfo'

export function BrukerMeny(): ReactElement {
    const { data: aktivBruker } = useBrukerinfo()
    const { data: roller } = useBrukerRoller()

    if (!aktivBruker) {
        return <Skeleton className="m-2" variant="rectangle" width={180} height={40} />
    }

    // Vis leserolle kun hvis bruker ikke har saksbehandler eller beslutter rolle
    const visLeserolle = roller.leserolle && !roller.saksbehandler && !roller.beslutter

    return (
        <Dropdown>
            <InternalHeaderUserButton as={DropdownToggle} name={aktivBruker.navn} />
            <DropdownMenu>
                <dl>
                    <BodyShort as="dt" size="small">
                        {aktivBruker.navn}
                    </BodyShort>
                    <Detail as="dd">{aktivBruker.navIdent}</Detail>
                    <Detail as="dd" size="small">
                        {aktivBruker.preferredUsername}
                    </Detail>

                    {/* Vis roller under kontaktinformasjonen */}
                    {visLeserolle && (
                        <Detail as="dd" size="small">
                            Leserolle
                        </Detail>
                    )}
                    {roller.saksbehandler && (
                        <Detail as="dd">
                            <HStack gap="2" align="center">
                                <PersonPencilIcon fontSize="1rem" />
                                <span>Saksbehandler</span>
                            </HStack>
                        </Detail>
                    )}
                    {roller.beslutter && (
                        <Detail as="dd">
                            <HStack gap="2" align="center">
                                <TasklistFillIcon fontSize="1rem" />
                                <span>Beslutter</span>
                            </HStack>
                        </Detail>
                    )}
                </dl>

                <DropdownMenuDivider />
                <Tastatursnarveier />
                <DropdownMenuDivider />
                <DarkModeToggle />
                <DropdownMenuDivider />
                <DropdownMenuList>
                    <DropdownMenuListItem as="a" href="/oauth2/logout">
                        Logg ut <Spacer /> <LeaveIcon aria-hidden fontSize="1.5rem" />
                    </DropdownMenuListItem>
                </DropdownMenuList>
            </DropdownMenu>
        </Dropdown>
    )
}
