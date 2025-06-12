import { NextResponse } from 'next/server'

import { Person } from '@/mock-api/session'

export async function handlePersoninfo(person: Person | undefined): Promise<Response> {
    if (!person) {
        return NextResponse.json(
            {
                message: 'Person not found',
            },
            { status: 404 },
        )
    }
    return NextResponse.json({
        fødselsnummer: person.fnr,
        aktørId: person.personinfo.aktørId,
        navn: person.personinfo.navn,
        alder: person.personinfo.alder,
    })
}

export async function handleDokumenter(): Promise<Response> {
    return NextResponse.json([
        {
            id: '1',
            type: 'INNTEKTSMELDING',
            sendtTilNAVTidsunkt: '2025-01-01T09:12:10',
        },
        {
            id: '2',
            type: 'SØKNAD',
            sendtTilNAVTidsunkt: '2025-01-01T08:06:30',
        },
        {
            id: '3',
            type: 'SYKMELDING',
            sendtTilNAVTidsunkt: '2025-01-01T07:30:00',
        },
    ])
}
