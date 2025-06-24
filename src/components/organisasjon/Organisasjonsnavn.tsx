'use client'

import { useOrganisasjonsnavn } from '@/hooks/queries/useOrganisasjonsnavn'

interface OrganisasjonsnavnProps {
    orgnummer: string
}

export function Organisasjonsnavn({ orgnummer }: OrganisasjonsnavnProps) {
    const { data: organisasjonsnavn, isLoading, error } = useOrganisasjonsnavn(orgnummer)

    if (isLoading) {
        return `${orgnummer} (laster...)`
    }

    if (error || !organisasjonsnavn) {
        return `${orgnummer} (ukjent organisasjon)`
    }

    return organisasjonsnavn
}
