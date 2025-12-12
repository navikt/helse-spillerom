import { useBrukerRoller } from './useBrukerRoller'
import { useAktivBehandling } from './useAktivBehandling'
import { useBrukerinfo } from './useBrukerinfo'

export function useKanSaksbehandles() {
    const { data: brukerRoller } = useBrukerRoller()
    const { data: brukerinfo } = useBrukerinfo()
    const aktivSaksbehandlingsperiode = useAktivBehandling()

    return (
        brukerRoller.saksbehandler &&
        aktivSaksbehandlingsperiode?.status === 'UNDER_BEHANDLING' &&
        aktivSaksbehandlingsperiode.opprettetAvNavIdent === brukerinfo?.navIdent
    )
}
