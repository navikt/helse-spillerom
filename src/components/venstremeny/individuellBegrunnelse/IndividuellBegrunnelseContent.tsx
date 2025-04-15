import React, { Dispatch, SetStateAction } from 'react'
import { ExpandIcon } from '@navikt/aksel-icons'
import { Box, Button, ReadMore } from '@navikt/ds-react'

import { BegrunnelseInput } from '@components/venstremeny/individuellBegrunnelse/BegrunnelseInput'

interface IndividuellBegrunnelseContentProps {
    erReadOnly: boolean
    erBeslutteroppgave: boolean
    vedtakBegrunnelseTekst: string
    setVedtakBegrunnelseTekst: Dispatch<SetStateAction<string>>
    defaultÅpen: boolean
    åpneModal: () => void
}

export const IndividuellBegrunnelseContent = ({
    erReadOnly,
    erBeslutteroppgave,
    vedtakBegrunnelseTekst,
    setVedtakBegrunnelseTekst,
    defaultÅpen,
    åpneModal,
}: IndividuellBegrunnelseContentProps) => (
    <Box marginBlock="0 4" paddingBlock="4 0">
        {!erReadOnly && !erBeslutteroppgave && (
            <Box position="relative">
                <ReadMore
                    size="small"
                    defaultOpen={defaultÅpen}
                    header={
                        vedtakBegrunnelseTekst === '' ? (
                            <span>Individuell begrunnelse</span>
                        ) : (
                            <strong>Individuell begrunnelse</strong>
                        )
                    }
                >
                    <Button
                        onClick={åpneModal}
                        icon={<ExpandIcon title="åpne i modal" />}
                        size="xsmall"
                        variant="tertiary-neutral"
                        style={{ position: 'absolute', top: 0, right: 0 }}
                    />
                    <BegrunnelseInput
                        vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                        setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                        minRows={4}
                    />
                </ReadMore>
            </Box>
        )}
    </Box>
)
