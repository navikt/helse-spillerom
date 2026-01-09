'use client'

import React, { ReactElement } from 'react'
import { Dialog, Table, Tooltip } from '@navikt/ds-react'
import { InboxUpIcon, ParagraphIcon, WalletIcon } from '@navikt/aksel-icons'
import { InternalHeaderButton } from '@navikt/ds-react/InternalHeader'

import { useRouteParams } from '@hooks/useRouteParams'
import { erDevLokalEllerDemo, erProd } from '@/env'
import { VilkårsvurderingInnsikt } from '@/components/saksbilde/vilkårsvurdering/VilkårsvurderingInnsikt'
import { TestdataMeny } from '@components/header/utvikling/TestdataMeny'
import { BrukerVelgerMeny } from '@components/header/utvikling/BrukerVelgerMeny'
import { RetroTemaToggle } from '@components/header/utvikling/RetroTemaToggle'

import { BergingssporingInnsikt } from '../../saksbilde/vilkårsvurdering/BergingssporingInnsikt'
import { OppdragDebug } from '../../saksbilde/utbetalingsberegning/OppdragDebug'
import { KafkaOutboxTabell } from '../../saksbilde/kafka/KafkaOutboxTabell'

const DIALOG_POPUP_CLASS = 'left-auto m-10 max-h-[calc(100vh-5rem)] max-w-[1200px] min-w-[900px] rounded-none p-0'

export function UtviklingMeny(): ReactElement | null {
    const { behandlingId } = useRouteParams()

    if (!erDevLokalEllerDemo) return null

    return (
        <>
            <TestdataMeny />
            <BrukerVelgerMeny />
            <RetroTemaToggle />

            <Dialog>
                <Tooltip content="Kafka outbox">
                    <Dialog.Trigger>
                        <InternalHeaderButton aria-label="Åpne Kafka outbox">
                            <InboxUpIcon aria-hidden fontSize="1.5rem" />
                        </InternalHeaderButton>
                    </Dialog.Trigger>
                </Tooltip>
                <Dialog.Popup className={DIALOG_POPUP_CLASS}>
                    <Dialog.Header>
                        <Dialog.Title>Kafka Outbox</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <KafkaOutboxTabell />
                    </Dialog.Body>
                </Dialog.Popup>
            </Dialog>

            {!erProd && behandlingId && (
                <>
                    <Dialog>
                        <Tooltip content="Vilkårsvurderinger">
                            <Dialog.Trigger>
                                <InternalHeaderButton aria-label="Åpne vilkårsvurdering">
                                    <ParagraphIcon aria-hidden fontSize="1.5rem" />
                                </InternalHeaderButton>
                            </Dialog.Trigger>
                        </Tooltip>
                        <Dialog.Popup className={DIALOG_POPUP_CLASS}>
                            <Dialog.Header>
                                <Dialog.Title>Vilkår og beregning</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Table>
                                    <Table.Body>
                                        <VilkårsvurderingInnsikt />
                                        <BergingssporingInnsikt />
                                    </Table.Body>
                                </Table>
                            </Dialog.Body>
                        </Dialog.Popup>
                    </Dialog>

                    <Dialog>
                        <Tooltip content="Oppdrag">
                            <Dialog.Trigger>
                                <InternalHeaderButton aria-label="Åpne oppdrag">
                                    <WalletIcon aria-hidden fontSize="1.5rem" />
                                </InternalHeaderButton>
                            </Dialog.Trigger>
                        </Tooltip>
                        <Dialog.Popup className={DIALOG_POPUP_CLASS}>
                            <Dialog.Header>
                                <Dialog.Title>Oppdrag</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <OppdragDebug />
                            </Dialog.Body>
                        </Dialog.Popup>
                    </Dialog>
                </>
            )}
        </>
    )
}
