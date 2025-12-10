'use client'

import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { BodyShort, Detail, Modal, Table, Tooltip } from '@navikt/ds-react'
import {
    ChatIcon,
    CheckmarkIcon,
    CodeIcon,
    InboxUpIcon,
    ParagraphIcon,
    PersonGroupIcon,
    PersonPencilIcon,
    WalletIcon,
} from '@navikt/aksel-icons'
import { ModalBody } from '@navikt/ds-react/Modal'
import { InternalHeaderButton } from '@navikt/ds-react/InternalHeader'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
    Dropdown,
    DropdownMenu,
    DropdownMenuDivider,
    DropdownMenuList,
    DropdownMenuListItem,
    DropdownToggle,
} from '@navikt/ds-react/Dropdown'

import { useRouteParams } from '@hooks/useRouteParams'
import { useRegisterShortcutHandler } from '@components/tastatursnarveier/useRegisterShortcutHandler'
import { erDevLokalEllerDemo, erProd } from '@/env'
import { VilkårsvurderingInnsikt } from '@/components/saksbilde/vilkårsvurdering/VilkårsvurderingInnsikt'
import { useBrukerinfo } from '@hooks/queries/useBrukerinfo'
import { useTilgjengeligeBrukere } from '@hooks/queries/useTilgjengeligeBrukere'
import { useOppdaterBrukerRoller } from '@hooks/mutations/useOppdaterBrukerRoller'
import { useTestpersoner } from '@hooks/queries/useTestpersoner'
import { useNullstillSession } from '@hooks/mutations/useNullstillSession'

import { BergingssporingInnsikt } from '../../saksbilde/vilkårsvurdering/BergingssporingInnsikt'
import { OppdragDebug } from '../../saksbilde/utbetalingsberegning/OppdragDebug'
import { KafkaOutboxTabell } from '../../saksbilde/kafka/KafkaOutboxTabell'

type ModalType = 'vilkårsvurdering' | 'oppdrag' | 'kafkaoutbox' | null

function RetroTemaToggleHeader(): ReactElement {
    const [wantsRetroTema, setWantsRetroTema] = useState(false)
    const { theme, setTheme } = useTheme()

    const isRetroTema = theme === 'dark' && wantsRetroTema

    useEffect(() => {
        if (isRetroTema) {
            document.documentElement.classList.add('retro-tema')
        } else {
            document.documentElement.classList.remove('retro-tema')
        }
    }, [isRetroTema])

    const handleRetroToggle = () => {
        if (theme !== 'dark' && !wantsRetroTema) {
            setTheme('dark')
            setWantsRetroTema(true)
        } else {
            setWantsRetroTema(!wantsRetroTema)
        }
    }

    return (
        <Tooltip content="Toggle retro tema">
            <InternalHeaderButton
                type="button"
                onClick={handleRetroToggle}
                aria-label="Toggle retro tema"
                className={isRetroTema ? 'bg-purple-600 text-white border-purple-600' : ''}
            >
                <CodeIcon title="Toggle retro tema" fontSize="1.5rem" />
            </InternalHeaderButton>
        </Tooltip>
    )
}
export function UtviklingMeny(): ReactElement | null {
    const [activeModal, setActiveModal] = useState<ModalType>(null)
    const { behandlingId } = useRouteParams()
    const testdataMenyRef = useRef<{ åpne: () => void }>(null)

    useRegisterShortcutHandler('open_testdata', () => {
        testdataMenyRef.current?.åpne()
    })

    if (!erDevLokalEllerDemo) {
        return null
    }

    const showUtviklingButtons = !erProd && behandlingId

    const closeModal = () => setActiveModal(null)

    return (
        <>
            <TestdataMeny />
            <BrukerVelgerMeny />
            <RetroTemaToggleHeader />
            <Tooltip content="Kafka outbox">
                <InternalHeaderButton
                    type="button"
                    onClick={() => setActiveModal('kafkaoutbox')}
                    aria-label="Åpne Kafka outbox"
                >
                    <InboxUpIcon title="Åpne Kafka outbox" fontSize="1.5rem" />
                </InternalHeaderButton>
            </Tooltip>

            {/* Utvikling knapper for saksbehandlingsperiode */}
            {showUtviklingButtons && (
                <>
                    <Tooltip content="Vilkårsvurderinger">
                        <InternalHeaderButton
                            type="button"
                            onClick={() => setActiveModal('vilkårsvurdering')}
                            aria-label="Åpne vilkårsvurdering utvikling"
                        >
                            <ParagraphIcon title="Åpne vilkårsvurdering utvikling" fontSize="1.5rem" />
                        </InternalHeaderButton>
                    </Tooltip>

                    <Tooltip content="Oppdrag">
                        <InternalHeaderButton
                            type="button"
                            onClick={() => setActiveModal('oppdrag')}
                            aria-label="Åpne oppdrag utvikling"
                        >
                            <WalletIcon title="Åpne oppdrag utvikling" fontSize="1.5rem" />
                        </InternalHeaderButton>
                    </Tooltip>
                </>
            )}

            {/* Modaler */}
            {activeModal === 'vilkårsvurdering' && (
                <Modal
                    open={true}
                    onClose={closeModal}
                    header={{ heading: 'Vilkår og beregning', closeButton: true, icon: <ParagraphIcon /> }}
                    className="left-auto m-10 h-screen max-h-max min-h-[600px] max-w-[1200px] min-w-[800px] rounded-none p-0"
                >
                    <ModalBody className="space-y-6">
                        <Table>
                            <Table.Body>
                                <VilkårsvurderingInnsikt />
                                <BergingssporingInnsikt />
                            </Table.Body>
                        </Table>
                    </ModalBody>
                </Modal>
            )}

            {activeModal === 'oppdrag' && (
                <Modal
                    open={true}
                    onClose={closeModal}
                    header={{ heading: 'Oppdrag', closeButton: true }}
                    className="left-auto m-10 h-screen max-h-max min-h-[600px] max-w-[1200px] min-w-[800px] rounded-none p-0"
                >
                    <ModalBody>
                        <OppdragDebug />
                    </ModalBody>
                </Modal>
            )}

            {activeModal === 'kafkaoutbox' && (
                <Modal
                    open={true}
                    onClose={closeModal}
                    header={{ heading: 'Kafka Outbox', closeButton: true, icon: <ChatIcon /> }}
                    className="left-auto m-10 h-screen max-h-max min-h-[600px] max-w-[1200px] min-w-[800px] rounded-none p-0"
                >
                    <ModalBody>
                        <KafkaOutboxTabell />
                    </ModalBody>
                </Modal>
            )}
        </>
    )
}

const TestdataMeny = React.forwardRef<{ åpne: () => void }, Record<string, never>>((_, ref) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const testpersoner = useTestpersoner()
    const nullstillSession = useNullstillSession()

    React.useImperativeHandle(ref, () => ({
        åpne: () => setOpen(true),
    }))

    const handleTestpersonClick = (pseudoId: string) => {
        setOpen(false)
        router.push(`/person/${pseudoId}`)
    }

    const handleTestscenarioerClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setOpen(false)
        router.push('/testscenarioer')
    }

    const handleNullstillSession = () => {
        nullstillSession.mutate()
    }

    const testpersonerMedPersonId = testpersoner.data?.filter((person) => person.spilleromId !== null) || []

    return (
        <Dropdown open={open} onOpenChange={setOpen}>
            <Tooltip content="Testpersoner">
                <InternalHeaderButton as={DropdownToggle} aria-label="Åpne testdataverktøy">
                    <PersonGroupIcon title="Åpne testdataverktøy" fontSize="1.5rem" />
                </InternalHeaderButton>
            </Tooltip>
            <DropdownMenu className="max-h-[600px] min-w-[320px] overflow-y-auto">
                <DropdownMenuList>
                    <DropdownMenuListItem as="div" onClick={handleTestscenarioerClick}>
                        Se testscenarier
                    </DropdownMenuListItem>
                    <DropdownMenuListItem onClick={handleNullstillSession}>Nullstill sesjon</DropdownMenuListItem>
                    {testpersoner.isLoading && (
                        <DropdownMenuListItem as="div" className="p-3">
                            <BodyShort size="small">Laster...</BodyShort>
                        </DropdownMenuListItem>
                    )}
                    {testpersoner.isError && (
                        <DropdownMenuListItem as="div" className="p-3">
                            <BodyShort size="small" className="text-red-600">
                                Feil: {testpersoner.error?.message || 'Ukjent feil'}
                            </BodyShort>
                        </DropdownMenuListItem>
                    )}
                    {testpersoner.isSuccess && testpersonerMedPersonId.length === 0 && (
                        <DropdownMenuListItem as="div" className="p-3">
                            <BodyShort size="small">Ingen testpersoner tilgjengelig</BodyShort>
                        </DropdownMenuListItem>
                    )}
                    {testpersoner.isSuccess && testpersonerMedPersonId.length > 0 && (
                        <>
                            <DropdownMenuDivider />
                            {testpersonerMedPersonId.map((person) => (
                                <DropdownMenuListItem
                                    key={person.fnr}
                                    as="button"
                                    type="button"
                                    onClick={() => handleTestpersonClick(person.spilleromId!)}
                                    className="flex flex-col items-start gap-1"
                                >
                                    <BodyShort size="small" as="span" className="font-semibold">
                                        {person.navn}
                                    </BodyShort>
                                    <Detail>{person.fnr}</Detail>
                                </DropdownMenuListItem>
                            ))}
                        </>
                    )}
                </DropdownMenuList>
            </DropdownMenu>
        </Dropdown>
    )
})

TestdataMeny.displayName = 'TestdataMeny'

function BrukerVelgerMeny(): ReactElement {
    const [open, setOpen] = useState(false)
    const { data: aktivBruker } = useBrukerinfo()
    const { data: tilgjengeligeBrukere = [] } = useTilgjengeligeBrukere()
    const oppdaterBruker = useOppdaterBrukerRoller()

    const handleBrukerValg = async (navIdent: string) => {
        await oppdaterBruker.mutateAsync({ navIdent })
        setOpen(false)
    }

    return (
        <Dropdown open={open} onOpenChange={setOpen}>
            <Tooltip content="Endre bruker">
                <InternalHeaderButton as={DropdownToggle} aria-label="Endre bruker">
                    <PersonPencilIcon title="Endre bruker" fontSize="1.5rem" />
                </InternalHeaderButton>
            </Tooltip>
            <DropdownMenu className="min-w-[320px]">
                <DropdownMenuList>
                    {tilgjengeligeBrukere.map((bruker) => {
                        const erAktiv = aktivBruker?.navIdent === bruker.navIdent
                        return (
                            <DropdownMenuListItem
                                key={bruker.navIdent}
                                as="button"
                                type="button"
                                disabled={oppdaterBruker.isPending}
                                onClick={() => handleBrukerValg(bruker.navIdent)}
                                className="flex flex-col items-start gap-1"
                            >
                                <span className="flex w-full items-center justify-between gap-2">
                                    <BodyShort size="small" as="span" className="font-semibold">
                                        {bruker.navn}
                                    </BodyShort>
                                    {erAktiv && <CheckmarkIcon aria-hidden className="text-green-600" />}
                                </span>
                                <Detail>
                                    {bruker.navIdent} • {bruker.roller.join(', ')}
                                </Detail>
                            </DropdownMenuListItem>
                        )
                    })}
                </DropdownMenuList>
            </DropdownMenu>
        </Dropdown>
    )
}
