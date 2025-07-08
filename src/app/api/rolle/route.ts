import { NextRequest, NextResponse } from 'next/server'

import { ErrorResponse } from '@/auth/beskyttetApi'
import { erLokalEllerDemo } from '@/env'
import { hentBrukerRoller, oppdaterBrukerRoller } from '@/mock-api/session'
import { Rolle } from '@/schemas/bruker'

export async function GET(): Promise<NextResponse<Rolle[] | ErrorResponse>> {
    if (erLokalEllerDemo) {
        const roller = await hentBrukerRoller()
        return NextResponse.json(roller)
    }
    return NextResponse.json(
        {
            message: 'Not found',
        },
        { status: 404 },
    )
}

export async function POST(request: NextRequest): Promise<NextResponse<{ success: boolean } | ErrorResponse>> {
    if (erLokalEllerDemo) {
        try {
            const { roller } = await request.json()
            await oppdaterBrukerRoller(roller)
            return NextResponse.json({ success: true })
        } catch (error) {
            return NextResponse.json(
                {
                    message: 'Feil ved oppdatering av roller',
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
