import { useBrukerRoller } from './useBrukerRoller'
import { useAktivSaksbehandlingsperiode } from './useAktivSaksbehandlingsperiode'
import { useBrukerinfo } from './useBrukerinfo'

export function useKanSaksbehandles() {
    const { data: brukerRoller } = useBrukerRoller()
    const { data: brukerinfo } = useBrukerinfo()
    const aktivSaksbehandlingsperiode = useAktivSaksbehandlingsperiode()

    return (
        brukerRoller.saksbehandler &&
        aktivSaksbehandlingsperiode?.status === 'UNDER_BEHANDLING' &&
        aktivSaksbehandlingsperiode.opprettetAvNavIdent === brukerinfo?.navIdent
    )
}
