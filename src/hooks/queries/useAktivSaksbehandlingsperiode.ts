import { useParams } from 'next/navigation'

import { Saksbehandlingsperiode } from '@schemas/saksbehandlingsperiode'

import { useSaksbehandlingsperioder } from './useSaksbehandlingsperioder'

function findAktivSaksbehandlingsperiode(
    saksbehandlingsperioder: Saksbehandlingsperiode[] | undefined,
    saksbehandlingsperiodeId: string | undefined,
) {
    if (!saksbehandlingsperioder || !saksbehandlingsperiodeId) return undefined
    return saksbehandlingsperioder.find((periode) => periode.id === saksbehandlingsperiodeId)
}

export function useAktivSaksbehandlingsperiode() {
    const { saksbehandlingsperiodeId } = useParams<{ saksbehandlingsperiodeId: string }>()
    const { data } = useSaksbehandlingsperioder()
    return findAktivSaksbehandlingsperiode(data, saksbehandlingsperiodeId)
}

export function useAktivSaksbehandlingsperiodeMedLoading() {
    const { saksbehandlingsperiodeId } = useParams<{ saksbehandlingsperiodeId: string }>()
    const { data, isLoading } = useSaksbehandlingsperioder()
    return {
        aktivSaksbehandlingsperiode: findAktivSaksbehandlingsperiode(data, saksbehandlingsperiodeId),
        isLoading,
    }
}
