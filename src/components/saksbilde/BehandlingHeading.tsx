'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import dayjs from 'dayjs'

import { usePersoninfo } from '@hooks/queries/usePersoninfo'
import { useBehandlinger } from '@hooks/queries/useBehandlinger'
import { getFormattedDateString } from '@utils/date-format'
import { Behandling } from '@schemas/behandling'
import { useRouteParams } from '@hooks/useRouteParams'

export function BehandlingHeading({ className }: { className?: string }) {
    const router = useRouter()
    const { personId, behandlingId } = useRouteParams()
    const pathname = usePathname()
    const { data: personinfo } = usePersoninfo()
    const { data: saksbehandlingsperioder, isSuccess: saksbehandlingsperioderLoaded } = useBehandlinger()

    const aktivPeriode = getAktivPeriode(saksbehandlingsperioder, behandlingId)
    const formattedFom = formatShortDate(aktivPeriode?.fom)
    const formattedTom = formatShortDate(aktivPeriode?.tom)

    // Naviger til person-siden hvis det ikke finnes noen saksbehandlingsperioder
    useEffect(() => {
        if (
            saksbehandlingsperioderLoaded &&
            personId &&
            saksbehandlingsperioder &&
            saksbehandlingsperioder.length === 0
        ) {
            router.replace(`/person/${personId}`)
        }
    }, [personId, saksbehandlingsperioder, saksbehandlingsperioderLoaded, router])

    useEffect(() => {
        if (!aktivPeriode || !behandlingId) return
        if (aktivPeriode.id !== behandlingId) {
            router.replace(pathname.replace(behandlingId, aktivPeriode.id), { scroll: false })
        }
    }, [aktivPeriode, behandlingId, pathname, router])

    if (!personinfo || !aktivPeriode) {
        return <h1 className={`sr-only ${className || ''}`}>Sykepengesak - Laster...</h1>
    }

    return (
        <h1 className={`sr-only ${className || ''}`}>
            Sykepengesak {personinfo.fødselsnummer} – {personinfo.navn} ({personinfo.alder} år) – {formattedFom} –{' '}
            {formattedTom} {new Date(aktivPeriode.tom).getFullYear()}
        </h1>
    )
}

function getAktivPeriode(saksbehandlingsperioder: Behandling[] | undefined, behandlingId: string | undefined) {
    if (!saksbehandlingsperioder || saksbehandlingsperioder.length === 0) return null
    if (!behandlingId) return null

    const periode = saksbehandlingsperioder.find((periode) => periode.id === behandlingId)
    if (periode) return periode

    return saksbehandlingsperioder.reduce((latest, p) => (dayjs(p.tom).isAfter(dayjs(latest.tom)) ? p : latest))
}

function formatShortDate(dateString: string | undefined) {
    if (!dateString) return ''
    const fullDate = getFormattedDateString(dateString)
    return fullDate.substring(0, 5) // DD.MM
}
