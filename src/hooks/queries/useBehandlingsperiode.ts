import { Behandling } from '@schemas/behandling'

import { useBehandlinger } from './useBehandlinger'

function findBehandling(saksbehandlingsperioder: Behandling[] | undefined, behandlingId: string | undefined) {
    if (!saksbehandlingsperioder || !behandlingId) return undefined
    return saksbehandlingsperioder.find((periode) => periode.id === behandlingId)
}

export function useBehandlingsperiodeMedLoading(id: string) {
    const { data, isLoading } = useBehandlinger()
    return {
        behandling: findBehandling(data, id),
        isLoading,
    }
}
