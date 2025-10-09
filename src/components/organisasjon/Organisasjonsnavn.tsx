'use client'

import { CopyButton } from '@navikt/ds-react'
import { ReactElement } from 'react'

import { useOrganisasjonsnavn } from '@/hooks/queries/useOrganisasjonsnavn'

interface OrganisasjonsnavnProps {
    orgnummer: string
    medOrgnummer?: boolean
}

export function Organisasjonsnavn({ orgnummer, medOrgnummer = false }: OrganisasjonsnavnProps): ReactElement {
    const { data: organisasjonsnavn, isLoading, error } = useOrganisasjonsnavn(orgnummer)

    if (isLoading) return <>{orgnummer} (laster...)</>
    if (error || !organisasjonsnavn) return <>{orgnummer} (ukjent organisasjon)</>

    if (medOrgnummer) {
        return (
            <span className="flex flex-row items-center">
                {organisasjonsnavn} ({orgnummer} <CopyButton copyText={orgnummer} size="xsmall" />)
            </span>
        )
    }

    return <>{organisasjonsnavn}</>
}
