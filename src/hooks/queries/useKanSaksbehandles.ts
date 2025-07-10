import { useMemo } from 'react'

import { useBrukerRoller } from './useBrukerRoller'
import { useAktivSaksbehandlingsperiode } from './useAktivSaksbehandlingsperiode'

export function useKanSaksbehandles() {
    const { data: brukerRoller } = useBrukerRoller()
    const aktivSaksbehandlingsperiode = useAktivSaksbehandlingsperiode()

    const kanSaksbehandles = useMemo(() => {
        return brukerRoller.saksbehandler && aktivSaksbehandlingsperiode?.status === 'UNDER_BEHANDLING'
    }, [brukerRoller.saksbehandler, aktivSaksbehandlingsperiode?.status])

    return kanSaksbehandles
}
