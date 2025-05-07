import { NextResponse } from 'next/server'

import { hentEllerOpprettPerson } from '@/mock-api/session'
import { ProblemDetails } from '@/schemas/problemDetails'

export async function personsøk(req: Request) {
    const reqJson = await req.json()
    const ident = reqJson.ident as string
    if (!(ident.length == 11 || ident.length == 13)) {
        const detail: ProblemDetails = {
            type: 'https://spillerom.ansatt.nav.no/validation/input',
            title: 'Bad Request',
            status: 400,
            detail: 'Ident må være 11 eller 13 siffer lang',
            instance: '/v1/personsok',
        }
        return NextResponse.json(detail, { status: 400 })
    }
    if (ident.startsWith('9')) {
        const detail: ProblemDetails = {
            type: 'about:blank',
            title: 'Person ikke funnet',
            status: 404,
            detail: 'Fant ikke person i PDL',
            instance: null,
        }
        return NextResponse.json(detail, { status: 404 })
    }

    const person = await hentEllerOpprettPerson(ident)
    return NextResponse.json({ personId: person.personId })
}
