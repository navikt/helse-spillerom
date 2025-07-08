'use client'

import React, { PropsWithChildren, ReactElement, useState } from 'react'
import { Button, Modal, Tooltip } from '@navikt/ds-react'
import { ParagraphIcon, BriefcaseIcon, SandboxIcon, PersonIcon } from '@navikt/aksel-icons'
import { ModalBody } from '@navikt/ds-react/Modal'
import { useParams } from 'next/navigation'

import { useRegisterShortcutHandler } from '@components/tastatursnarveier/useRegisterShortcutHandler'
import { erProd, erLokalEllerDemo } from '@/env'
import { VilkårsvurderingDebug } from '@components/saksbilde/vilkårsvurdering/VilkårsvurderingDebug'
import { InntektsforholdDebug } from '@components/saksbilde/inntektsforhold/InntektsforholdDebug'
import { TestpersonTabell } from '@components/debugging/TestpersonTabell'
import { RetroTemaToggle } from '@components/RetroTemaToggle'
import { RolleModal } from '@components/header/brukermeny/RolleModal'

type ModalType = 'vilkårsvurdering' | 'inntektsforhold' | 'testdata' | 'roller' | null

export function DebuggingProvider({ children }: PropsWithChildren): ReactElement {
    const [activeModal, setActiveModal] = useState<ModalType>(null)
    const params = useParams()

    useRegisterShortcutHandler('open_testdata', () => setActiveModal('testdata'))

    const showDebuggingButtons = !erProd && params.saksbehandlingsperiodeId
    const showTestdataButton = erLokalEllerDemo
    const showRolleButton = erLokalEllerDemo

    const closeModal = () => setActiveModal(null)

    return (
        <div className="relative min-h-screen">
            {children}

            {/* Debugging knapper */}
            <div className="fixed bottom-4 left-16 z-50 flex flex-row gap-2">
                {/* Testdata knapp */}
                {showTestdataButton && (
                    <Tooltip content="Testpersoner">
                        <Button
                            type="button"
                            onClick={() => setActiveModal('testdata')}
                            icon={<SandboxIcon title="Åpne testdataverktøy" aria-hidden />}
                            variant="tertiary-neutral"
                        />
                    </Tooltip>
                )}

                {/* Rolle knapp */}
                {showRolleButton && (
                    <Tooltip content="Endre roller">
                        <Button
                            type="button"
                            onClick={() => setActiveModal('roller')}
                            icon={<PersonIcon title="Endre brukerroller" aria-hidden />}
                            variant="tertiary-neutral"
                        />
                    </Tooltip>
                )}

                {/* Retro tema knapp */}
                <RetroTemaToggle />

                {/* Debugging knapper for saksbehandlingsperiode */}
                {showDebuggingButtons && (
                    <>
                        <Tooltip content="Vilkårsvurderinger">
                            <Button
                                type="button"
                                onClick={() => setActiveModal('vilkårsvurdering')}
                                icon={<ParagraphIcon title="Åpne vilkårsvurdering debugging" aria-hidden />}
                                variant="tertiary-neutral"
                            />
                        </Tooltip>

                        <Tooltip content="Inntektsforhold">
                            <Button
                                type="button"
                                onClick={() => setActiveModal('inntektsforhold')}
                                icon={<BriefcaseIcon title="Åpne inntektsforhold debugging" aria-hidden />}
                                variant="tertiary-neutral"
                            />
                        </Tooltip>
                    </>
                )}
            </div>

            {/* Modaler */}
            {activeModal === 'vilkårsvurdering' && (
                <Modal
                    open={true}
                    onClose={closeModal}
                    header={{ heading: 'Vurderte vilkår', closeButton: true }}
                    className="left-auto m-0 m-10 h-screen max-h-max min-h-[600px] max-w-[1200px] min-w-[800px] rounded-none p-0"
                >
                    <ModalBody>
                        <VilkårsvurderingDebug />
                    </ModalBody>
                </Modal>
            )}

            {activeModal === 'inntektsforhold' && (
                <Modal
                    open={true}
                    onClose={closeModal}
                    header={{ heading: 'Inntektsforhold', closeButton: true }}
                    className="left-auto m-0 m-10 h-screen max-h-max min-h-[600px] max-w-[1200px] min-w-[800px] rounded-none p-0"
                >
                    <ModalBody>
                        <InntektsforholdDebug />
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
                        <TestpersonTabell />
                    </ModalBody>
                </Modal>
            )}

            {activeModal === 'roller' && <RolleModal open={true} onClose={closeModal} />}
        </div>
    )
}
