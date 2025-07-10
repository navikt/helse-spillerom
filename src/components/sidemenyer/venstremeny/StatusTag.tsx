'use client'

import { Tag } from '@navikt/ds-react'
import { ReactElement } from 'react'

import { useAktivSaksbehandlingsperiode } from '@hooks/queries/useAktivSaksbehandlingsperiode'
import { SaksbehandlingsperiodeStatus } from '@schemas/saksbehandlingsperiode'

function getStatusTekstOgVariant(status: SaksbehandlingsperiodeStatus): {
    tekst: string
    variant: 'info' | 'success' | 'warning' | 'error' | 'neutral'
} {
    switch (status) {
        case 'UNDER_BEHANDLING':
            return { tekst: 'Under behandling', variant: 'info' }
        case 'TIL_BESLUTNING':
            return { tekst: 'Til beslutning', variant: 'warning' }
        case 'UNDER_BESLUTNING':
            return { tekst: 'Under beslutning', variant: 'warning' }
        case 'GODKJENT':
            return { tekst: 'Godkjent', variant: 'success' }
        default:
            return { tekst: status, variant: 'neutral' }
    }
}

export function StatusTag(): ReactElement | null {
    const aktivSaksbehandlingsperiode = useAktivSaksbehandlingsperiode()

    if (!aktivSaksbehandlingsperiode) return null

    const { tekst, variant } = getStatusTekstOgVariant(aktivSaksbehandlingsperiode.status)

    return (
        <div role="region" aria-label="Status på saksbehandlingsperiode">
            <Tag variant={variant} size="medium" aria-label={`Status: ${tekst}`}>
                {tekst}
            </Tag>
        </div>
    )
}
