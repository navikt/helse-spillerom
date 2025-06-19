'use client'

import React, { PropsWithChildren, ReactElement, useState } from 'react'
import { Button, Modal, Table, Tooltip } from '@navikt/ds-react'
import { BriefcaseIcon } from '@navikt/aksel-icons'
import { ModalBody } from '@navikt/ds-react/Modal'
import { useParams } from 'next/navigation'

import { useInntektsforhold } from '@hooks/queries/useInntektsforhold'
import { erProd } from '@/env'

export function InntektsforholdDebugging({ children }: PropsWithChildren): ReactElement {
    const [showModal, setShowModal] = useState(false)
    const params = useParams()

    if (erProd || !params.saksbehandlingsperiodeId) {
        return <>{children}</>
    }
    return (
        <div className="relative min-h-screen">
            {children}

            <div className="fixed right-32 bottom-4 z-50">
                <Tooltip content="Inntektsforhold">
                    <Button
                        type="button"
                        onClick={() => setShowModal((prev) => !prev)}
                        icon={<BriefcaseIcon title="Åpne inntektsforhold debugging" aria-hidden />}
                        variant="tertiary-neutral"
                    />
                </Tooltip>
            </div>
            {showModal && (
                <Modal
                    open={showModal}
                    onClose={() => {
                        setShowModal(false)
                    }}
                    header={{ heading: 'Inntektsforhold', closeButton: true }}
                    className="left-auto m-0 m-10 h-screen max-h-max min-h-[600px] max-w-[1200px] min-w-[800px] rounded-none p-0"
                >
                    <ModalBody>
                        <InntektsforholdDebug />
                    </ModalBody>
                </Modal>
            )}
        </div>
    )
}

function InntektsforholdDebug(): ReactElement {
    const { data: inntektsforhold = [] } = useInntektsforhold()

    return (
        <div className="space-y-6">
            {inntektsforhold.map((forhold, index) => (
                <div key={forhold.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 border-b border-gray-200 pb-2">
                        <h3 className="text-sm font-semibold text-gray-700">Inntektsforhold #{index + 1}</h3>
                    </div>
                    <Table>
                        <Table.Body>
                            {Object.entries(forhold.kategorisering).map(([key, value]) => (
                                <Table.Row key={`${forhold.id}-${key}`}>
                                    <Table.DataCell>
                                        <div className="text-sm font-medium">{key}</div>
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <div className="text-sm">{Array.isArray(value) ? value.join(', ') : value}</div>
                                    </Table.DataCell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            ))}
        </div>
    )
}
