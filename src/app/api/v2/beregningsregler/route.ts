import { NextResponse } from 'next/server'

import { beskyttetApi, ErrorResponse } from '@/auth/beskyttetApi'
import { erLokal } from '@/env'
import { BeregningsreglerArray } from '@schemas/beregningsregler'
import { beregningsregler } from '@/mock-api/kodeverk/beregningsregler'

export async function GET(request: Request): Promise<NextResponse<BeregningsreglerArray | ErrorResponse>> {
    return await beskyttetApi<BeregningsreglerArray | ErrorResponse>(
        request,
        async (): Promise<NextResponse<BeregningsreglerArray | ErrorResponse>> => {
            if (!erLokal) {
                try {
                    const response = await fetch(
                        'https://sp-kodeverk.ekstern.dev.nav.no/api/v2/open/beregningsregler',
                        {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                            },
                            cache: 'no-cache',
                        },
                    )

                    if (!response.ok) {
                        return NextResponse.json(
                            { message: `Kunne ikke hente beregningsregler (${response.status})` },
                            { status: response.status },
                        )
                    }

                    const data: BeregningsreglerArray = await response.json()
                    return NextResponse.json(data)
                } catch (error) {
                    return NextResponse.json(
                        { message: 'Feil ved henting av beregningsregler fra ekstern tjeneste' },
                        { status: 500 },
                    )
                }
            }

            // For lokal utvikling, returner tom struktur
            return Promise.resolve(NextResponse.json(beregningsregler))
        },
    )
}
