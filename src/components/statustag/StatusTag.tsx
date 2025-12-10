import { Tag } from '@navikt/ds-react'
import { ReactElement } from 'react'

import { Behandling, BehandlingStatus } from '@schemas/behandling'

export const statusTilTekst: Record<BehandlingStatus, string> = {
    UNDER_BEHANDLING: 'Under behandling',
    TIL_BESLUTNING: 'Til beslutning',
    UNDER_BESLUTNING: 'Under beslutning',
    GODKJENT: 'Godkjent',
    REVURDERT: 'Revurdert',
}

const statusTilTagVariant = (status: BehandlingStatus): 'info' | 'warning' | 'success' | 'error' => {
    switch (status) {
        case 'UNDER_BEHANDLING':
            return 'info'
        case 'TIL_BESLUTNING':
            return 'warning'
        case 'UNDER_BESLUTNING':
            return 'warning'
        case 'REVURDERT':
            return 'error'
        case 'GODKJENT':
            return 'success'
        default:
            return 'info'
    }
}

function getStatusTekstOgVariant(status: BehandlingStatus): {
    tekst: string
    variant: 'info' | 'success' | 'warning' | 'error' | 'neutral'
} {
    const tekst = statusTilTekst[status]
    const variant = statusTilTagVariant(status)
    return { tekst, variant }
}

export function StatusTag({ periode, size }: { periode?: Behandling; size: 'small' | 'medium' }): ReactElement | null {
    if (!periode) {
        return null
    }
    const { tekst, variant } = getStatusTekstOgVariant(periode.status)

    return (
        <Tag variant={variant} size={size} aria-label={`Status: ${tekst}`}>
            {tekst}
        </Tag>
    )
}
