import { NextResponse } from 'next/server'

import { hentEllerOpprettPerson } from '@/mock-api/session'

export async function personsøk(req: Request) {
    const reqJson = await req.json()

    const person = await hentEllerOpprettPerson(reqJson.fødselsnummer || '12345678912')
    return NextResponse.json({ personId: person.personId })
}
