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


