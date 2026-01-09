import { ReactElement } from 'react'
import { ActionMenu, BodyShort, Detail, HStack, Tooltip } from '@navikt/ds-react'
import { InternalHeaderButton } from '@navikt/ds-react/InternalHeader'
import { CheckmarkIcon, PersonPencilIcon } from '@navikt/aksel-icons'

import { useOppdaterBrukerRoller } from '@hooks/mutations/useOppdaterBrukerRoller'
import { useTilgjengeligeBrukere } from '@hooks/queries/useTilgjengeligeBrukere'
import { useBrukerinfo } from '@hooks/queries/useBrukerinfo'

export function BrukerVelgerMeny(): ReactElement {
    const { data: aktivBruker } = useBrukerinfo()
    const { data: tilgjengeligeBrukere = [] } = useTilgjengeligeBrukere()
    const oppdaterBruker = useOppdaterBrukerRoller()

    const handleBrukerValg = async (navIdent: string) => {
        await oppdaterBruker.mutateAsync({ navIdent })
    }

    return (
        <ActionMenu>
            <Tooltip content="Endre bruker">
                <ActionMenu.Trigger>
                    <InternalHeaderButton aria-label="Endre bruker">
                        <PersonPencilIcon aria-hidden fontSize="1.5rem" />
                    </InternalHeaderButton>
                </ActionMenu.Trigger>
            </Tooltip>
            <ActionMenu.Content className="min-w-[320px]">
                <ActionMenu.Group label="Brukere">
                    {tilgjengeligeBrukere.map((bruker) => (
                        <ActionMenu.Item
                            key={bruker.navIdent}
                            disabled={oppdaterBruker.isPending}
                            onSelect={() => handleBrukerValg(bruker.navIdent)}
                            className="mb-1 flex flex-col items-start gap-0"
                        >
                            <HStack justify="space-between" gap="2" align="center" className="w-full">
                                <BodyShort size="small" as="span" className="font-semibold">
                                    {bruker.navn}
                                </BodyShort>
                                {aktivBruker?.navIdent === bruker.navIdent && (
                                    <CheckmarkIcon aria-hidden className="text-green-600" />
                                )}
                            </HStack>
                            <Detail>
                                {bruker.navIdent} • {bruker.roller.join(', ')}
                            </Detail>
                        </ActionMenu.Item>
                    ))}
                </ActionMenu.Group>
            </ActionMenu.Content>
        </ActionMenu>
    )
}
