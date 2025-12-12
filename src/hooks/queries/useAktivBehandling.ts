import { Behandling } from '@schemas/behandling'
import { useRouteParams } from '@hooks/useRouteParams'

import { useBehandlinger } from './useBehandlinger'

function findAktivBehandling(behandlinger: Behandling[] | undefined, behandlingId: string | undefined) {
    if (!behandlinger || !behandlingId) return undefined
    return behandlinger.find((behandling) => behandling.id === behandlingId)
}

export function useAktivBehandling() {
    const { behandlingId } = useRouteParams()
    const { data } = useBehandlinger()
    return findAktivBehandling(data, behandlingId)
}

export function useAktivBehandlingMedLoading() {
    const { behandlingId } = useRouteParams()
    const { data, isLoading } = useBehandlinger()
    return {
        aktivBehandling: findAktivBehandling(data, behandlingId),
        isLoading,
    }
}
