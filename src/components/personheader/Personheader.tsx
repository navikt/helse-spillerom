import React, { ReactElement } from 'react'
import { BodyShort } from '@navikt/ds-react'
import { useParams, useRouter } from 'next/navigation'

import { GenderIcon } from '@/components/personheader/GenderIcon'
import { Fødselsnummer } from '@/components/personheader/Fødselsnummer'
import { AktørId } from '@/components/personheader/AktørId'

export const PersonHeaderWithContent = ({ person }: { person: Person }): ReactElement => {
    const params = useParams()
    const router = useRouter()
    return (
        <div className="flex border-b items-center h-12 box-border px-8 whitespace-nowrap min-w-max">
            <GenderIcon />
            <BodyShort
                weight="semibold"
                as="a"
                href={'/person/' + params.aktorId}
                onClick={(e) => {
                    e.preventDefault()
                    router.push('/person/' + params.aktorId)
                }}
                className="cursor-hand  hover:underline"
            >{`${person.navn} (${person.alder} år)`}</BodyShort>
            <BodyShort className="mx-4">/</BodyShort>
            <Fødselsnummer fødselsnummer={person.fodselsnummer} />
            <BodyShort className="mx-4">/</BodyShort>
            <AktørId aktørId={person.aktorId} />
            <BodyShort className="mx-4">/</BodyShort>
            <BodyShort>
                Boenhet: {person.bohenetId} ({person.boenhetNavn})
            </BodyShort>
        </div>
    )
}

interface Person {
    fodselsnummer: string
    aktorId: string
    navn: string
    alder: number
    bohenetId: string
    boenhetNavn: string
}
