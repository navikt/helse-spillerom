import { Behandling } from '@schemas/behandling'
import { useRouteParams } from '@hooks/useRouteParams'

import { useBehandlinger } from './useBehandlinger'

function findAktivSaksbehandlingsperiode(
    saksbehandlingsperioder: Behandling[] | undefined,
    behandlingId: string | undefined,
) {
    if (!saksbehandlingsperioder || !behandlingId) return undefined
    return saksbehandlingsperioder.find((periode) => periode.id === behandlingId)
}

export function useAktivSaksbehandlingsperiode() {
    const { behandlingId } = useRouteParams()
    const { data } = useBehandlinger()
    return findAktivSaksbehandlingsperiode(data, behandlingId)
}

export function useAktivSaksbehandlingsperiodeMedLoading() {
    const { behandlingId } = useRouteParams()
    const { data, isLoading } = useBehandlinger()
    return {
        aktivSaksbehandlingsperiode: findAktivSaksbehandlingsperiode(data, behandlingId),
        isLoading,
    }
}
