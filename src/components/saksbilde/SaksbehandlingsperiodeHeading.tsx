'use client'

import { useParams } from 'next/navigation'
import { useMemo } from 'react'

import { usePersoninfo } from '@hooks/queries/usePersoninfo'
import { useSaksbehandlingsperioder } from '@hooks/queries/useSaksbehandlingsperioder'
import { getFormattedDateString } from '@utils/date-format'

interface SaksbehandlingsperiodeHeadingProps {
    className?: string
}

export function SaksbehandlingsperiodeHeading({ className }: SaksbehandlingsperiodeHeadingProps) {
    const params = useParams()
    const { data: personinfo } = usePersoninfo()
    const { data: saksbehandlingsperioder } = useSaksbehandlingsperioder()

    const aktivPeriode = useMemo(() => {
        if (!saksbehandlingsperioder || !params.saksbehandlingsperiodeId) return null
        return saksbehandlingsperioder.find((periode) => periode.id === params.saksbehandlingsperiodeId)
    }, [saksbehandlingsperioder, params.saksbehandlingsperiodeId])

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
