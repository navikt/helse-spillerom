import { ReactElement } from 'react'
import { Modal, VStack, HStack, BodyShort, Button, Heading } from '@navikt/ds-react'
import { ModalBody, ModalHeader, ModalFooter } from '@navikt/ds-react/Modal'

import { useUtbetalingsberegning } from '@hooks/queries/useUtbetalingsberegning'
import { useYrkesaktivitet } from '@hooks/queries/useYrkesaktivitet'
import { beregnUtbetalingssum, formaterUtbetalingssum } from '@utils/utbetalingsberegning'

interface SendTilGodkjenningModalProps {
    åpen: boolean
    onLukk: () => void
    onSendTilGodkjenning: () => void
}

export function SendTilGodkjenningModal({
    åpen,
    onLukk,
    onSendTilGodkjenning,
}: SendTilGodkjenningModalProps): ReactElement {
    const { data: utbetalingsberegning } = useUtbetalingsberegning()
    const { data: yrkesaktivitet } = useYrkesaktivitet()

    // Beregn utbetalinger
    const utbetalingssum = beregnUtbetalingssum(utbetalingsberegning, yrkesaktivitet)
    const formatertUtbetalingssum = formaterUtbetalingssum(utbetalingssum)

    const håndterJa = () => {
        onSendTilGodkjenning()
        onLukk()
    }

    return (
        <Modal aria-label="Send til godkjenning modal" open={åpen} onClose={onLukk} portal closeOnBackdropClick>
            <ModalHeader>
                <Heading size="medium">Er du sikker?</Heading>
            </ModalHeader>
            <ModalBody>
                <VStack gap="4">
                    {utbetalingssum.totalBeløpØre > 0 ? (
                        <div>
                            <VStack gap="3">
                                <BodyShort weight="semibold">Beløp til utbetaling</BodyShort>

                                {/* Vis arbeidsgivere med refusjonsutbetaling først */}
                                {formatertUtbetalingssum.arbeidsgivere.map((arbeidsgiver) => (
                                    <HStack key={arbeidsgiver.orgnummer} justify="space-between">
                                        <BodyShort size="small">{arbeidsgiver.navn}</BodyShort>
                                        <BodyShort size="small">{arbeidsgiver.totalBeløp}</BodyShort>
                                    </HStack>
                                ))}

                                {/* Total sum */}
                                <HStack justify="space-between" className="border-t pt-2">
                                    <BodyShort weight="semibold">Totalt</BodyShort>
                                    <BodyShort weight="semibold">{formatertUtbetalingssum.totalBeløp}</BodyShort>
                                </HStack>
                            </VStack>
                        </div>
                    ) : (
                        <div>
                            <BodyShort size="small" className="text-gray-600">
                                Beløp til utbetaling
                            </BodyShort>
                            <BodyShort weight="semibold">0,00 kr</BodyShort>
                        </div>
                    )}

                    <BodyShort size="small" className="text-gray-700">
                        Når du trykker ja sendes saken til beslutter for godkjenning.
                    </BodyShort>
                </VStack>
            </ModalBody>
            <ModalFooter>
                <HStack gap="2">
                    <Button variant="primary" onClick={håndterJa}>
                        Ja
                    </Button>
                    <Button variant="secondary" onClick={onLukk}>
                        Avbryt
                    </Button>
                </HStack>
            </ModalFooter>
        </Modal>
    )
}
