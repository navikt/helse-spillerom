import { NextResponse } from 'next/server'

import { hentEllerOpprettPerson } from '@/mock-api/session'

export async function personsøk(req: Request) {
    const reqJson = await req.json()
    const ident = reqJson.ident as string
    if (ident.length !== 11) {
        return NextResponse.json(
            {
                message: 'Ugyldig ident',
            },
            { status: 400 },
        )
    }

    const person = await hentEllerOpprettPerson(ident)
    return NextResponse.json({ personId: person.personId })
}
