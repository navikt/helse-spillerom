import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { Person } from '@/mock-api/session'
import { Dokument, Dokumenttype } from '@/schemas/dokument'
import { ainntektData } from '@/mock-api/ainntekt'
import { mockArbeidsforhold } from '@/mock-api/aareg'
import { handleGetPensjonsgivendeInntekt } from '@/mock-api/handlers/pensjonsgivende-inntekt-handlers'

export async function handleDokumenter(
    person: Person | undefined,
    saksbehandlingsperiodeId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json(
            {
                message: 'Person not found',
            },
            { status: 404 },
        )
    }

    // Hent dokumenter fra person-objektet basert på saksbehandlingsperiodeId
    const dokumenter = person.dokumenter?.[saksbehandlingsperiodeId] || []

    return NextResponse.json(dokumenter)
}

interface AInntektHentRequest {
    fom: string // YearMonth format: "2024-01"
    tom: string // YearMonth format: "2024-12"
}

export async function handleAinntektHent(
    request: Request,
    person: Person | undefined,
    saksbehandlingsperiodeId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    const body: AInntektHentRequest = await request.json()

    // Initialiser dokumenter hvis de ikke finnes
    if (!person.dokumenter) {
        person.dokumenter = {}
    }
    if (!person.dokumenter[saksbehandlingsperiodeId]) {
        person.dokumenter[saksbehandlingsperiodeId] = []
    }

    // Opprett nytt ainntekt-dokument
    const dokumentId = uuidv4()
    const nyttDokument: Dokument = {
        id: dokumentId,
        dokumentType: 'ainntekt828' as Dokumenttype,
        eksternId: null,
        innhold: ainntektData, // Bruk mock ainntekt-data
        opprettet: new Date().toISOString(),
        request: {
            kilde: 'A-inntekt',
            tidsstempel: new Date().toISOString(),
            fom: body.fom,
            tom: body.tom,
        },
    }

    // Legg til dokumentet i person-objektet
    person.dokumenter[saksbehandlingsperiodeId].push(nyttDokument)

    // Bygg Location-header URL (simulerer bakrommet-strukturen)
    const locationUrl = `/v1/${person.personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/dokumenter/${dokumentId}`

    // Returner dokumentet med 201 Created og Location-header
    return NextResponse.json(nyttDokument, {
        status: 201,
        headers: {
            Location: locationUrl,
        },
    })
}

export async function handleArbeidsforholdHent(
    request: Request,
    person: Person | undefined,
    saksbehandlingsperiodeId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    // Initialiser dokumenter hvis de ikke finnes
    if (!person.dokumenter) {
        person.dokumenter = {}
    }
    if (!person.dokumenter[saksbehandlingsperiodeId]) {
        person.dokumenter[saksbehandlingsperiodeId] = []
    }

    // Opprett nytt arbeidsforhold-dokument
    const dokumentId = uuidv4()
    const nyttDokument: Dokument = {
        id: dokumentId,
        dokumentType: 'arbeidsforhold' as Dokumenttype,
        eksternId: null,
        innhold: mockArbeidsforhold, // Bruk mock aareg-data
        opprettet: new Date().toISOString(),
        request: {
            kilde: 'Aa-registeret',
            tidsstempel: new Date().toISOString(),
        },
    }

    // Legg til dokumentet i person-objektet
    person.dokumenter[saksbehandlingsperiodeId].push(nyttDokument)

    // Bygg Location-header URL (simulerer bakrommet-strukturen)
    const locationUrl = `/v1/${person.personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/dokumenter/${dokumentId}`

    // Returner dokumentet med 201 Created og Location-header
    return NextResponse.json(nyttDokument, {
        status: 201,
        headers: {
            Location: locationUrl,
        },
    })
}

export async function handlePensjonsgivendeInntektHent(
    request: Request,
    person: Person | undefined,
    saksbehandlingsperiodeId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    // Initialiser dokumenter hvis de ikke finnes
    if (!person.dokumenter) {
        person.dokumenter = {}
    }
    if (!person.dokumenter[saksbehandlingsperiodeId]) {
        person.dokumenter[saksbehandlingsperiodeId] = []
    }

    // Hent pensjonsgivende inntekt data
    const pensjonsgivendeInntektResponse = await handleGetPensjonsgivendeInntekt(person.personId)
    const pensjonsgivendeInntektData = await pensjonsgivendeInntektResponse.json()

    // Opprett nytt pensjonsgivende inntekt-dokument
    const dokumentId = uuidv4()
    const nyttDokument: Dokument = {
        id: dokumentId,
        dokumentType: 'pensjonsgivendeinntekt' as Dokumenttype,
        eksternId: null,
        innhold: pensjonsgivendeInntektData,
        opprettet: new Date().toISOString(),
        request: {
            kilde: 'Sigrun',
            tidsstempel: new Date().toISOString(),
        },
    }

    // Legg til dokumentet i person-objektet
    person.dokumenter[saksbehandlingsperiodeId].push(nyttDokument)

    // Bygg Location-header URL (simulerer bakrommet-strukturen)
    const locationUrl = `/v1/${person.personId}/saksbehandlingsperioder/${saksbehandlingsperiodeId}/dokumenter/${dokumentId}`

    // Returner dokumentet med 201 Created og Location-header
    return NextResponse.json(nyttDokument, {
        status: 201,
        headers: {
            Location: locationUrl,
        },
    })
}
