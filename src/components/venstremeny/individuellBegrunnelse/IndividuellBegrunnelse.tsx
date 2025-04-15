import React, { ReactElement, useState } from 'react'

import { BegrunnelseModal } from '@components/venstremeny/individuellBegrunnelse/BegrunnelseModal'
import { IndividuellBegrunnelseContent } from '@components/venstremeny/individuellBegrunnelse/IndividuellBegrunnelseContent'

export const IndividuellBegrunnelse = (): ReactElement => {
    const [modalÅpen, setModalÅpen] = useState(false)
    const [vedtakBegrunnelseTekst, setVedtakBegrunnelseTekst] = useState('')
    const erReadOnly = false

    const erBeslutteroppgave = false

    const åpneModal = () => setModalÅpen(true)
    const lukkModal = () => setModalÅpen(false)

    return (
        <>
            <IndividuellBegrunnelseContent
                erReadOnly={erReadOnly}
                erBeslutteroppgave={erBeslutteroppgave}
                vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                defaultÅpen={false}
                åpneModal={åpneModal}
            />

            {modalÅpen && (
                <BegrunnelseModal
                    modalÅpen={modalÅpen}
                    lukkModal={lukkModal}
                    vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                    setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                />
            )}
        </>
    )
}
