import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

import { Person } from '@/mock-api/session'

export async function handleGetUtbetalingsberegning(person: Person | undefined, uuid: string): Promise<Response> {
    if (!person) {
        return NextResponse.json({ message: 'Person not found' }, { status: 404 })
    }

    // Sjekk om vi har en lagret beregning i sesjonen
    if (person.utbetalingsberegning && person.utbetalingsberegning[uuid]) {
        const beregningData = person.utbetalingsberegning[uuid]
        const response = {
            id: uuidv4(),
            saksbehandlingsperiodeId: uuid,
            beregningData,
            opprettet: new Date().toISOString(),
            opprettetAv: 'bakrommet-demo-api',
            sistOppdatert: new Date().toISOString(),
        }
        return NextResponse.json(response)
    }

    // Returner null hvis ingen beregning finnes
    return NextResponse.json(null, { status: 200 })
}
