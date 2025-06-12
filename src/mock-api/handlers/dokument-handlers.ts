import { NextResponse } from 'next/server'

import { Person } from '@/mock-api/session'
import { Dokument } from '@/schemas/dokument'

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