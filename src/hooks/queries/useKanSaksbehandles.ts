import { useMemo } from 'react'

import { useBrukerRoller } from './useBrukerRoller'
import { useAktivSaksbehandlingsperiode } from './useAktivSaksbehandlingsperiode'
import { useBrukerinfo } from './useBrukerinfo'

export function useKanSaksbehandles() {
    const { data: brukerRoller } = useBrukerRoller()
    const { data: brukerinfo } = useBrukerinfo()

    const aktivSaksbehandlingsperiode = useAktivSaksbehandlingsperiode()

    const kanSaksbehandles = useMemo(() => {
        return (
            brukerRoller.saksbehandler &&
            aktivSaksbehandlingsperiode?.status === 'UNDER_BEHANDLING' &&
            aktivSaksbehandlingsperiode.opprettetAvNavIdent === brukerinfo?.navIdent
        )
    }, [
        brukerRoller.saksbehandler,
        aktivSaksbehandlingsperiode?.status,
        aktivSaksbehandlingsperiode?.opprettetAvNavIdent,
        brukerinfo?.navIdent,
    ])

    return kanSaksbehandles
}
