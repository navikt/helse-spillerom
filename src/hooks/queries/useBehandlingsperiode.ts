import { Saksbehandlingsperiode } from '@schemas/saksbehandlingsperiode'

import { useSaksbehandlingsperioder } from './useSaksbehandlingsperioder'

function findBehandling(
    saksbehandlingsperioder: Saksbehandlingsperiode[] | undefined,
    saksbehandlingsperiodeId: string | undefined,
) {
    if (!saksbehandlingsperioder || !saksbehandlingsperiodeId) return undefined
    return saksbehandlingsperioder.find((periode) => periode.id === saksbehandlingsperiodeId)
}

export function useBehandlingsperiodeMedLoading(id: string) {
    const { data, isLoading } = useSaksbehandlingsperioder()
    return {
        behandling: findBehandling(data, id),
        isLoading,
    }
}
