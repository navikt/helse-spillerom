import { Saksbehandlingsperiode } from '@schemas/saksbehandlingsperiode'
import { useRouteParams } from '@hooks/useRouteParams'

import { useSaksbehandlingsperioder } from './useSaksbehandlingsperioder'

function findAktivSaksbehandlingsperiode(
    saksbehandlingsperioder: Saksbehandlingsperiode[] | undefined,
    saksbehandlingsperiodeId: string | undefined,
) {
    if (!saksbehandlingsperioder || !saksbehandlingsperiodeId) return undefined
    return saksbehandlingsperioder.find((periode) => periode.id === saksbehandlingsperiodeId)
}

export function useAktivSaksbehandlingsperiode() {
    const { saksbehandlingsperiodeId } = useRouteParams()
    const { data } = useSaksbehandlingsperioder()
    return findAktivSaksbehandlingsperiode(data, saksbehandlingsperiodeId)
}

export function useAktivSaksbehandlingsperiodeMedLoading() {
    const { saksbehandlingsperiodeId } = useRouteParams()
    const { data, isLoading } = useSaksbehandlingsperioder()
    return {
        aktivSaksbehandlingsperiode: findAktivSaksbehandlingsperiode(data, saksbehandlingsperiodeId),
        isLoading,
    }
}
