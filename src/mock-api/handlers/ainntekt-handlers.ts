import { NextResponse } from 'next/server'

import { ainntektData } from '../ainntekt'

export async function handleGetAinntekt(personId: string) {
    // TODO implementer forskjellig mock-data basert på personId hvis nødvendig. Legg ainntekt på testperson objektene da
    if (personId === 'bosse') {
        return NextResponse.json(ainntektData)
    }
    return NextResponse.json(ainntektData)
}
