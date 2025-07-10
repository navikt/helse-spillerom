import { useParams } from 'next/navigation'
import { useMemo } from 'react'

import { useSaksbehandlingsperioder } from './useSaksbehandlingsperioder'

export function useAktivSaksbehandlingsperiode() {
    const params = useParams()
    const { data: saksbehandlingsperioder } = useSaksbehandlingsperioder()

    const aktivSaksbehandlingsperiode = useMemo(() => {
        return saksbehandlingsperioder?.find((periode) => periode.id === params.saksbehandlingsperiodeId)
    }, [saksbehandlingsperioder, params.saksbehandlingsperiodeId])

    return aktivSaksbehandlingsperiode
}
