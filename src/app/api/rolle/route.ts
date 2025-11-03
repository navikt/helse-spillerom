import { NextRequest, NextResponse } from 'next/server'

import { ErrorResponse } from '@/auth/beskyttetApi'
import { erDevLokalEllerDemo } from '@/env'
import { oppdaterAktivBruker } from '@/mock-api/session'

export async function POST(request: NextRequest): Promise<NextResponse<{ success: boolean } | ErrorResponse>> {
    if (erDevLokalEllerDemo) {
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
