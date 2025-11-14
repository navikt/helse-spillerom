'use client'

import React, { ReactElement, useState, useEffect, useCallback } from 'react'
import { BodyShort, Detail, Modal, Table, Tooltip } from '@navikt/ds-react'
import {
    ChatIcon,
    CodeIcon,
    CheckmarkIcon,
    InboxUpIcon,
    ParagraphIcon,
    PersonGroupIcon,
    PersonPencilIcon,
    WalletIcon,
} from '@navikt/aksel-icons'
import { ModalBody } from '@navikt/ds-react/Modal'
import { InternalHeaderButton } from '@navikt/ds-react/InternalHeader'
import { useParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
    Dropdown,
    DropdownMenu,
    DropdownMenuList,
    DropdownMenuListItem,
    DropdownToggle,
} from '@navikt/ds-react/Dropdown'

import { useRegisterShortcutHandler } from '@components/tastatursnarveier/useRegisterShortcutHandler'
import { erDevLokalEllerDemo, erProd } from '@/env'
import { VilkårsvurderingInnsikt } from '@/components/saksbilde/vilkårsvurdering/VilkårsvurderingInnsikt'
import { TestpersonTabell } from '@components/testdata/TestpersonTabell'
import { useBrukerinfo } from '@hooks/queries/useBrukerinfo'
import { useTilgjengeligeBrukere } from '@hooks/queries/useTilgjengeligeBrukere'
import { useOppdaterBrukerRoller } from '@hooks/mutations/useOppdaterBrukerRoller'

import { BergingssporingInnsikt } from '../../saksbilde/vilkårsvurdering/BergingssporingInnsikt'
import { OppdragDebug } from '../../saksbilde/utbetalingsberegning/OppdragDebug'
import { KafkaOutboxTabell } from '../../saksbilde/kafka/KafkaOutboxTabell'

type ModalType = 'vilkårsvurdering' | 'testdata' | 'oppdrag' | 'kafkaoutbox' | null

function RetroTemaToggleHeader(): ReactElement {
    const [isRetroTema, setIsRetroTema] = useState(false)
    const { theme, setTheme } = useTheme()

    const toggleRetroTema = useCallback(() => {
        const newRetroTema = !isRetroTema
        setIsRetroTema(newRetroTema)

        if (newRetroTema) {
            document.documentElement.classList.add('retro-tema')
        } else {
            document.documentElement.classList.remove('retro-tema')
        }
    }, [isRetroTema])

    useEffect(() => {
        if (theme === 'light' && isRetroTema) {
            setIsRetroTema(false)
            toggleRetroTema()
        }
    }, [theme, isRetroTema, toggleRetroTema])

    const handleRetroToggle = () => {
        if (theme !== 'dark' && !isRetroTema) {
            // Første klikk: Skru på darkmode + retro tema
            setTheme('dark')
            toggleRetroTema()
        } else if (theme === 'dark' && isRetroTema) {
            // Andre klikk: Skru av retro tema, la darkmode være på
            toggleRetroTema()
        } else if (theme === 'dark' && !isRetroTema) {
            // Tredje klikk: Skru på retro tema igjen
            toggleRetroTema()
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
    const params = useParams()

    useRegisterShortcutHandler('open_testdata', () => setActiveModal('testdata'))

    if (!erDevLokalEllerDemo) {
        return null
    }

    const showUtviklingButtons = !erProd && params.saksbehandlingsperiodeId
    const showTestdataButton = erDevLokalEllerDemo
    const showRolleButton = erDevLokalEllerDemo

    const closeModal = () => setActiveModal(null)

    return (
        <>
            {/* Testdata knapp */}
            {showTestdataButton && (
                <Tooltip content="Testpersoner">
                    <InternalHeaderButton
                        type="button"
                        onClick={() => setActiveModal('testdata')}
                        aria-label="Åpne testdataverktøy"
                    >
                        <PersonGroupIcon title="Åpne testdataverktøy" fontSize="1.5rem" />
                    </InternalHeaderButton>
                </Tooltip>
            )}

            {/* Rolle knapp */}
            {showRolleButton && <BrukerVelgerMeny />}

            {/* Retro tema knapp */}
            <RetroTemaToggleHeader />

            {/* Kafka outbox knapp */}
            {showTestdataButton && (
                <Tooltip content="Kafka outbox">
                    <InternalHeaderButton
                        type="button"
                        onClick={() => setActiveModal('kafkaoutbox')}
                        aria-label="Åpne Kafka outbox"
                    >
                        <InboxUpIcon title="Åpne Kafka outbox" fontSize="1.5rem" />
                    </InternalHeaderButton>
                </Tooltip>
            )}

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
                    className="left-auto m-0 m-10 h-screen max-h-max min-h-[600px] max-w-[1200px] min-w-[800px] rounded-none p-0"
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

            {activeModal === 'testdata' && (
                <Modal
                    open={true}
                    onClose={closeModal}
                    header={{ heading: 'Testdata', closeButton: true }}
                    className="left-auto m-0 h-screen max-h-max max-w-[369px] rounded-none p-0"
                >
                    <ModalBody>
                        <TestpersonTabell onClose={closeModal} />
                    </ModalBody>
                </Modal>
            )}

            {activeModal === 'oppdrag' && (
                <Modal
                    open={true}
                    onClose={closeModal}
                    header={{ heading: 'Oppdrag', closeButton: true }}
                    className="left-auto m-0 m-10 h-screen max-h-max min-h-[600px] max-w-[1200px] min-w-[800px] rounded-none p-0"
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
                    className="left-auto m-0 m-10 h-screen max-h-max min-h-[600px] max-w-[1200px] min-w-[800px] rounded-none p-0"
                >
                    <ModalBody>
                        <KafkaOutboxTabell />
                    </ModalBody>
                </Modal>
            )}
        </>
    )
}

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
                                <Detail size="small">
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
