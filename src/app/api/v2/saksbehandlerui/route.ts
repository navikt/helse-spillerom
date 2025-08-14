import { NextResponse } from 'next/server'

import { beskyttetApi, type ErrorResponse } from '@/auth/beskyttetApi'
import { erLokal } from '@/env'
import { type HovedspørsmålArray } from '@/schemas/saksbehandlergrensesnitt'
import { saksbehandlerUi } from '@/components/saksbilde/vilkårsvurdering/lokalSaksbehandlerui'

export async function GET(request: Request): Promise<NextResponse<HovedspørsmålArray | ErrorResponse>> {
    return await beskyttetApi<HovedspørsmålArray | ErrorResponse>(
        request,
        async (): Promise<NextResponse<HovedspørsmålArray | ErrorResponse>> => {
            if (!erLokal) {
                try {
                    const response = await fetch('https://sp-kodeverk.ekstern.dev.nav.no/api/v2/open/saksbehandlerui', {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                        },
                        cache: 'no-cache',
                    })

                    if (!response.ok) {
                        return NextResponse.json(
                            { message: `Kunne ikke hente saksbehandler-UI (${response.status})` },
                            { status: response.status },
                        )
                    }

                    const data: HovedspørsmålArray = await response.json()
                    return NextResponse.json(data)
                } catch (error) {
                    return NextResponse.json(
                        { message: 'Feil ved henting av saksbehandler-UI fra ekstern tjeneste' },
                        { status: 500 },
                    )
                }
            }

            // Lokal utvikling: returner statisk lokal JSON fra kodeverk-repoet
            return Promise.resolve(NextResponse.json(saksbehandlerUi))
        },
    )
}
