'use client'

import { ReactElement } from 'react'

import { useOrganisasjonsnavn } from '@/hooks/queries/useOrganisasjonsnavn'
import { OrgMedCopyButton } from '@components/organisasjon/OrgMedCopyButton'

interface OrganisasjonsnavnProps {
    orgnummer: string
    medOrgnummer?: boolean
}

export function Organisasjonsnavn({ orgnummer, medOrgnummer = false }: OrganisasjonsnavnProps): ReactElement {
    const { data: organisasjonsnavn, isLoading, error } = useOrganisasjonsnavn(orgnummer)

    if (isLoading) return <>{orgnummer} (laster...)</>
    if (error || !organisasjonsnavn) return <>{orgnummer} (ukjent organisasjon)</>

    if (medOrgnummer) {
        return <OrgMedCopyButton orgnummer={orgnummer} orgnavn={organisasjonsnavn} />
    }

    return <>{organisasjonsnavn}</>
}
