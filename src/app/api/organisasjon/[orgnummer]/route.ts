import { NextRequest, NextResponse } from 'next/server'

import { ProblemDetails } from '@/schemas/problemDetails'
import { organisasjonsnavnMap } from '@/utils/organisasjoner'

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
