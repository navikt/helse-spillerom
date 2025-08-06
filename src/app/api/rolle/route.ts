import { NextRequest, NextResponse } from 'next/server'

import { ErrorResponse } from '@/auth/beskyttetApi'
import { erLokalEllerDemo } from '@/env'
import { hentAktivBruker, oppdaterAktivBruker } from '@/mock-api/session'
import { Bruker, brukerSchema, Rolle } from '@/schemas/bruker'
import { fetchAndParse } from '@utils/fetch'

export async function GET(): Promise<NextResponse<{ bruker: Bruker; roller: Rolle[] } | ErrorResponse>> {
    if (erLokalEllerDemo) {
        const aktivBruker = await hentAktivBruker()
        return NextResponse.json({
            bruker: aktivBruker,
            roller: aktivBruker.roller,
        })
    }

    // TODO: Snakke med Håvard om dette
    const bruker = await fetchAndParse('/api/bakrommet/v1/bruker', brukerSchema)

    return NextResponse.json({
        bruker: bruker,
        roller: bruker.roller,
    })
}

export async function POST(request: NextRequest): Promise<NextResponse<{ success: boolean } | ErrorResponse>> {
    if (erLokalEllerDemo) {
        try {
            const { navIdent } = await request.json()
            await oppdaterAktivBruker(navIdent)
            return NextResponse.json({ success: true })
        } catch (error) {
            return NextResponse.json(
                {
                    message: 'Feil ved oppdatering av bruker',
                    error: error instanceof Error ? error.message : 'Ukjent feil',
                },
                { status: 500 },
            )
        }
    }
    return NextResponse.json(
        {
            message: 'Not found',
        },
        { status: 404 },
    )
}
