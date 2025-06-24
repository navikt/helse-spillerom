import { NextRequest, NextResponse } from 'next/server'

import { ProblemDetails } from '@/schemas/problemDetails'

// Hardkodet mapp av organisasjonsnummer til organisasjonsnavn basert på testdata
const organisasjonsnavnMap: Record<string, string> = {
    '987654321': 'Kranførerkompaniet',
    '123456789': 'Krankompisen',
    '889955555': 'Danskebåten',
    // Legg til flere organisasjoner fra andre testdata hvis nødvendig
    '963743254': 'Høyskolen i Bergen',
    '805824352': 'IT-Konsulentene AS',
    '896929119': 'Matservering Nord',
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orgnummer: string }> },
): Promise<NextResponse<string | ProblemDetails>> {
    const { orgnummer } = await params

    const organisasjonsnavn = organisasjonsnavnMap[orgnummer]

    if (!organisasjonsnavn) {
        const problemDetails: ProblemDetails = {
            type: 'about:blank',
            title: 'Organisasjon ikke funnet',
            status: 404,
            detail: `Fant ikke organisasjonsnavn for organisasjonsnummer ${orgnummer}`,
            instance: `/api/organisasjon/${orgnummer}`,
        }
        return NextResponse.json(problemDetails, { status: 404 })
    }

    return NextResponse.json(organisasjonsnavn)
}
