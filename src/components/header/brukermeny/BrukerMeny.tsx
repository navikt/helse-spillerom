'use client'

import { ActionMenu, BodyShort, Detail, HStack, Skeleton, VStack } from '@navikt/ds-react'
import { LeaveIcon, PersonPencilIcon, TasklistFillIcon } from '@navikt/aksel-icons'
import React, { ReactElement, useState } from 'react'
import { InternalHeaderUserButton } from '@navikt/ds-react/InternalHeader'
import { ActionMenuContent, ActionMenuDivider, ActionMenuItem, ActionMenuTrigger } from '@navikt/ds-react/ActionMenu'

import { useBrukerRoller } from '@hooks/queries/useBrukerRoller'
import { DarkModeToggle } from '@components/header/brukermeny/DarkModeToggle'
import { useBrukerinfo } from '@hooks/queries/useBrukerinfo'
import { AnonymiserToggle } from '@components/header/brukermeny/AnonymiserToggle'
import { useRegisterShortcutHandler } from '@components/tastatursnarveier/useRegisterShortcutHandler'
import { TastatursnarveierModal } from '@components/header/brukermeny/TastatursnarveierModal'

export function BrukerMeny(): ReactElement {
    const [showTastatursnarveierModal, setShowTastatursnarveierModal] = useState(false)
    useRegisterShortcutHandler('open_tastatursnarveier', () => setShowTastatursnarveierModal((prev) => !prev))
    const { data: aktivBruker } = useBrukerinfo()
    const { data: roller } = useBrukerRoller()

    if (!aktivBruker) {
        return <Skeleton className="m-2" variant="rectangle" width={180} height={40} />
    }

    // Vis leserolle kun hvis bruker ikke har saksbehandler eller beslutter rolle
    const visLeserolle = roller.leserolle && !roller.saksbehandler && !roller.beslutter

    return (
        <>
            <ActionMenu>
                <ActionMenuTrigger>
                    <InternalHeaderUserButton name={aktivBruker.navn} />
                </ActionMenuTrigger>
                <ActionMenuContent>
                    <VStack className="p-2">
                        <BodyShort size="small">{aktivBruker.navn}</BodyShort>
                        <Detail>{aktivBruker.navIdent}</Detail>
                        <Detail>{aktivBruker.preferredUsername}</Detail>

                        {visLeserolle && <Detail>Leserolle</Detail>}
                        {roller.saksbehandler && (
                            <HStack gap="2" align="center">
                                <PersonPencilIcon fontSize="1rem" />
                                <Detail>Saksbehandler</Detail>
                            </HStack>
                        )}
                        {roller.beslutter && (
                            <HStack gap="2" align="center">
                                <TasklistFillIcon fontSize="1rem" />
                                <Detail>Beslutter</Detail>
                            </HStack>
                        )}
                    </VStack>

                    <ActionMenuDivider />
                    <AnonymiserToggle />
                    <ActionMenuDivider />
                    <ActionMenuItem onSelect={() => setShowTastatursnarveierModal(true)}>
                        Tastatursnarveier
                    </ActionMenuItem>
                    <ActionMenuDivider />
                    <DarkModeToggle />
                    <ActionMenuDivider />
                    <ActionMenuItem as="a" href="/oauth2/logout" icon={<LeaveIcon aria-hidden />}>
                        Logg ut
                    </ActionMenuItem>
                </ActionMenuContent>
            </ActionMenu>
            <TastatursnarveierModal onOpenChange={setShowTastatursnarveierModal} open={showTastatursnarveierModal} />
        </>
    )
}
