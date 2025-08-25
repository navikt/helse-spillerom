import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { Person } from '@/mock-api/session'

export async function handleGetUtbetalingsberegning(person: Person | undefined, uuid: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    // Returner testdata for å demonstrere funksjonaliteten
    // I produksjon ville dette returnert null hvis ingen beregning finnes
    const testData = {
        id: uuidv4(),
        saksbehandlingsperiodeId: uuid,
        beregningData: {
            yrkesaktiviteter: [
                {
                    yrkesaktivitetId: person.yrkesaktivitet?.[uuid]?.[0]?.id || uuidv4(),
                    dager: [
                        {
                            dato: '2024-01-15',
                            utbetalingØre: 150000, // 1500 kr
                            refusjonØre: 50000, // 500 kr
                        },
                        {
                            dato: '2024-01-16',
                            utbetalingØre: 120000, // 1200 kr
                            refusjonØre: 30000, // 300 kr
                        },
                        {
                            dato: '2024-01-17',
                            utbetalingØre: 180000, // 1800 kr
                            refusjonØre: 80000, // 800 kr
                        },
                    ],
                },
            ],
        },
        opprettet: '2024-01-15T10:00:00Z',
        opprettetAv: 'test-bruker',
        sistOppdatert: '2024-01-15T10:00:00Z',
    }

    return NextResponse.json(testData)
}
