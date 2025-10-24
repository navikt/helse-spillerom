import { NextResponse } from 'next/server'

import { ArbeidstakerAinntekt, FrilanserAinntekt } from '@schemas/inntektData'

// Mock data for beregnet a-inntekt for arbeidstaker
const mockArbeidstakerAinntekt: ArbeidstakerAinntekt = {
    inntektstype: 'ARBEIDSTAKER_AINNTEKT',
    omregnetÅrsinntekt: 480000,
    sporing: 'Beregnet fra A-inntekt siste 3 måneder',
    kildedata: {
        '2024-10': 40000,
        '2024-09': 40000,
        '2024-08': 40000,
    },
}

// Mock data for beregnet a-inntekt for frilanser
const mockFrilanserAinntekt: FrilanserAinntekt = {
    inntektstype: 'FRILANSER_AINNTEKT',
    omregnetÅrsinntekt: 360000,
    sporing: 'Beregnet fra A-inntekt siste 3 måneder',
    kildedata: {
        '2024-10': 30000,
        '2024-09': 30000,
        '2024-08': 30000,
    },
}

// Respons type som kan være enten success eller error
type AinntektResponse =
    | {
          success: true
          data: ArbeidstakerAinntekt | FrilanserAinntekt
      }
    | {
          success: false
          feilmelding: string
      }

export async function handleGetAinntektForYrkesaktivitet(yrkesaktivitetId: string): Promise<Response> {
    // Simuler at vi henter data basert på yrkesaktivitetId
    // I en ekte implementasjon ville dette sjekket kategori fra yrkesaktiviteten
    // og returnert riktig data eller en feilmelding

    // For demo formål, la oss returnere arbeidstaker for de fleste tilfeller
    // og frilanser for spesifikke IDs
    const erFrilanser = yrkesaktivitetId.startsWith('frilanser') || yrkesaktivitetId.includes('8888')

    // Simuler noen feiltilfeller basert på ID
    if (yrkesaktivitetId.includes('feil')) {
        const response: AinntektResponse = {
            success: false,
            feilmelding: 'Kunne ikke hente a-inntekt for denne perioden',
        }
        return NextResponse.json(response)
    }

    if (yrkesaktivitetId.includes('mangler')) {
        const response: AinntektResponse = {
            success: false,
            feilmelding: 'Mangler a-inntekt for de siste 3 månedene',
        }
        return NextResponse.json(response)
    }

    // Returner suksess respons med data
    const response: AinntektResponse = {
        success: true,
        data: erFrilanser ? mockFrilanserAinntekt : mockArbeidstakerAinntekt,
    }

    return NextResponse.json(response)
}
