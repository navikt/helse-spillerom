import { useQuery } from '@tanstack/react-query'

import { Organisasjonsnavn } from '@/schemas/organisasjon'

const LOCALSTORAGE_KEY = 'organisasjonsnavnCache'
const TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 dager i millisekunder

interface CachedOrganisasjon {
    navn: string
    timestamp: number
}

function getCachedOrganisasjonsnavn(orgnummer: string): string | null {
    try {
        const cached = localStorage.getItem(LOCALSTORAGE_KEY)
        if (cached) {
            const cache = JSON.parse(cached) as Record<string, CachedOrganisasjon>
            const entry = cache[orgnummer]

            if (entry) {
                const now = Date.now()
                const isExpired = now - entry.timestamp > TTL_MS

                if (isExpired) {
                    // Fjern utløpt entry
                    delete cache[orgnummer]
                    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(cache))
                    return null
                }

                return entry.navn
            }
        }
    } catch {
        // Ignorerer feil ved parsing
    }
    return null
}

function setCachedOrganisasjonsnavn(orgnummer: string, navn: string): void {
    try {
        const existing = localStorage.getItem(LOCALSTORAGE_KEY)
        const cache = existing ? JSON.parse(existing) : {}

        cache[orgnummer] = {
            navn,
            timestamp: Date.now(),
        }

        // Rydd opp utløpte entries ved lagring
        cleanupExpiredEntries(cache)

        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(cache))
    } catch {
        // Ignorerer feil ved lagring
    }
}

function cleanupExpiredEntries(cache: Record<string, CachedOrganisasjon>): void {
    const now = Date.now()

    Object.keys(cache).forEach((orgnummer) => {
        const entry = cache[orgnummer]
        if (entry && now - entry.timestamp > TTL_MS) {
            delete cache[orgnummer]
        }
    })
}

export function useOrganisasjonsnavn(orgnummer: string) {
    return useQuery<Organisasjonsnavn, Error>({
        queryKey: ['organisasjonsnavn', orgnummer],
        queryFn: async () => {
            // Sjekk localStorage først
            const cached = getCachedOrganisasjonsnavn(orgnummer)
            if (cached) {
                return cached
            }

            const response = await fetch(`/api/organisasjon/${orgnummer}`)

            if (!response.ok) {
                throw new Error(`Feil ved henting av organisasjonsnavn: ${response.status}`)
            }

            const navn = await response.json()

            // Lagre i localStorage for fremtidige kall
            setCachedOrganisasjonsnavn(orgnummer, navn)

            return navn
        },
        enabled: Boolean(orgnummer),
        // Bruk cached data som initial data hvis tilgjengelig
        initialData: () => getCachedOrganisasjonsnavn(orgnummer) || undefined,
    })
}
