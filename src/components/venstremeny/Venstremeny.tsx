import React, { ReactElement } from 'react'
import { BodyShort, Button, Label } from '@navikt/ds-react'
import { usePathname } from 'next/navigation'

import { useBehandling } from '@hooks/queries/useBehandling'
import { Behandling } from '@typer/manuellbehandlingtypes'
import { IndividuellBegrunnelse } from '@components/venstremeny/individuellBegrunnelse/IndividuellBegrunnelse'

import styles from './Venstremeny.module.css'

export const VenstremenyBehandling = (): ReactElement => {
    const { data: behandling } = useBehandling()
    if (!behandling) {
        return <section className={styles.Venstremeny}></section>
    }
    return (
        <section className={styles.Venstremeny}>
            <SykmeldingPeriode behandling={behandling} />

            <div>
                <IndividuellBegrunnelse />
            </div>
            <div>
                <Button size="small">Send til godkjenning</Button>
            </div>
        </section>
    )
}

export const Venstremeny = (): ReactElement => {
    const pathname = usePathname()
    if (pathname.includes('behandling') && !pathname.includes('opprett')) {
        return <VenstremenyBehandling />
    }
    return <section className={styles.Venstremeny}></section>
}

const SykmeldingPeriode = ({ behandling }: { behandling: Behandling }) => {
    return (
        <div>
            <Label size="small" className="mb-4">
                Periode
            </Label>
            <BodyShort>
                {behandling.fom} - {behandling.tom}
            </BodyShort>
        </div>
    )
}
