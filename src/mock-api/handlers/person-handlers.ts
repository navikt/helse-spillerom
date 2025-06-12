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

export async function handleDokumenter(
    person: Person | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _saksbehandlingsperiodeId: string,
): Promise<Response> {
    if (!person) {
        return NextResponse.json(
            {
                message: 'Person not found',
            },
            { status: 404 },
        )
    }

    // Du kan her legge til logikk for å filtrere dokumenter basert på saksbehandlingsperiodeId
    // For nå returnerer vi bare mockdata
    return NextResponse.json([
        {
            id: '550e8400-e29b-41d4-a716-446655440001',
            dokumentType: 'INNTEKTSMELDING',
            eksternId: 'EXT-001',
            innhold: {
                tittel: 'Inntektsmelding for januar 2025',
                innhold: 'Detaljer om inntektsmelding...',
            },
            opprettet: '2025-01-01T09:12:10Z',
            request: {
                kilde: 'ALTINN',
                tidsstempel: '2025-01-01T09:12:10Z',
            },
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440002',
            dokumentType: 'SØKNAD',
            eksternId: 'EXT-002',
            innhold: {
                tittel: 'Søknad om sykepenger',
                innhold: 'Detaljer om søknad...',
            },
            opprettet: '2025-01-01T08:06:30Z',
            request: {
                kilde: 'NAV_NO',
                tidsstempel: '2025-01-01T08:06:30Z',
            },
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440003',
            dokumentType: 'SYKMELDING',
            eksternId: null,
            innhold: {
                tittel: 'Sykmelding',
                innhold: 'Detaljer om sykmelding...',
            },
            opprettet: '2025-01-01T07:30:00Z',
            request: {
                kilde: 'HELSE_NORGE',
                tidsstempel: '2025-01-01T07:30:00Z',
            },
        },
    ])
}
