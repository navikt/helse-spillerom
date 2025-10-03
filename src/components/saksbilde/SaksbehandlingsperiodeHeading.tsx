'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import dayjs from 'dayjs'

import { usePersoninfo } from '@hooks/queries/usePersoninfo'
import { useSaksbehandlingsperioder } from '@hooks/queries/useSaksbehandlingsperioder'
import { getFormattedDateString } from '@utils/date-format'

interface SaksbehandlingsperiodeHeadingProps {
    className?: string
}

export function SaksbehandlingsperiodeHeading({ className }: SaksbehandlingsperiodeHeadingProps) {
    const router = useRouter()
    const { saksbehandlingsperiodeId } = useParams() as { saksbehandlingsperiodeId: string }
    const pathname = usePathname()
    const { data: personinfo } = usePersoninfo()
    const { data: saksbehandlingsperioder } = useSaksbehandlingsperioder()

    const aktivPeriode = useMemo(() => {
        if (!saksbehandlingsperioder || !saksbehandlingsperiodeId) return null

        const periode = saksbehandlingsperioder.find((periode) => periode.id === saksbehandlingsperiodeId)
        if (periode) return periode

        return saksbehandlingsperioder.reduce((latest, p) => (dayjs(p.tom).isAfter(dayjs(latest.tom)) ? p : latest))
    }, [saksbehandlingsperioder, saksbehandlingsperiodeId])

    useEffect(() => {
        if (!aktivPeriode || !saksbehandlingsperiodeId) return
        if (aktivPeriode.id !== saksbehandlingsperiodeId) {
            router.replace(pathname.replace(saksbehandlingsperiodeId, aktivPeriode.id), { scroll: false })
        }
    }, [aktivPeriode, saksbehandlingsperiodeId, pathname, router])

    const formattedFom = useMemo(() => {
        if (!aktivPeriode?.fom) return ''
        // Konverter fra DD.MM.YYYY til DD.MM format
        const fullDate = getFormattedDateString(aktivPeriode.fom)
        return fullDate.substring(0, 5) // Tar kun DD.MM delen
    }, [aktivPeriode?.fom])

    const formattedTom = useMemo(() => {
        if (!aktivPeriode?.tom) return ''
        // Konverter fra DD.MM.YYYY til DD.MM format
        const fullDate = getFormattedDateString(aktivPeriode.tom)
        return fullDate.substring(0, 5) // Tar kun DD.MM delen
    }, [aktivPeriode?.tom])

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
