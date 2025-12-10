import { Saksbehandlingsperiode } from '@schemas/saksbehandlingsperiode'
import { useRouteParams } from '@hooks/useRouteParams'

import { useSaksbehandlingsperioder } from './useSaksbehandlingsperioder'

function findAktivSaksbehandlingsperiode(
    saksbehandlingsperioder: Saksbehandlingsperiode[] | undefined,
    behandlingId: string | undefined,
) {
    if (!saksbehandlingsperioder || !behandlingId) return undefined
    return saksbehandlingsperioder.find((periode) => periode.id === behandlingId)
}

export function useAktivSaksbehandlingsperiode() {
    const { behandlingId } = useRouteParams()
    const { data } = useSaksbehandlingsperioder()
    return findAktivSaksbehandlingsperiode(data, behandlingId)
}

export function useAktivSaksbehandlingsperiodeMedLoading() {
    const { behandlingId } = useRouteParams()
    const { data, isLoading } = useSaksbehandlingsperioder()
    return {
        aktivSaksbehandlingsperiode: findAktivSaksbehandlingsperiode(data, behandlingId),
        isLoading,
    }
}
