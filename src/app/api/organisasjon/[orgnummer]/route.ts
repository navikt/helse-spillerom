import { NextRequest, NextResponse } from 'next/server'

import { ProblemDetails } from '@/schemas/problemDetails'

// Hardkodet mapp av organisasjonsnummer til organisasjonsnavn basert på testdata
const organisasjonsnavnMap: Record<string, string> = {
    '987654321': 'Kranførerkompaniet',
    '123456789': 'Krankompisen',
    '889955555': 'Danskebåten',
    '972674818': 'Pengeløs Sparebank',
    '222222222': 'Ruter, avd Nesoddbåten',
    '805824352': 'Vegansk slakteri',
    '896929119': 'Sauefabrikk',
    '947064649': 'Sjokkerende elektriker',
    '967170232': 'Snill torpedo',
    '839942907': 'Hårreisende frisør',
    '907670201': 'Klonelabben',
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
