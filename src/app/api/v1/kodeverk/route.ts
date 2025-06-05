import { NextResponse } from 'next/server'

import { beskyttetApi, ErrorResponse } from '@/auth/beskyttetApi'
import { Kodeverk, kodeverk } from '@components/saksbilde/vilkårsvurdering/kodeverk'
import { erLokal } from '@/env'

export async function GET(request: Request): Promise<NextResponse<Kodeverk | ErrorResponse>> {
    return await beskyttetApi<Kodeverk | ErrorResponse>(
        request,
        async (): Promise<NextResponse<Kodeverk | ErrorResponse>> => {
            if (!erLokal) {
                try {
                    const response = await fetch('https://sp-kodeverk.ekstern.dev.nav.no/api/v1/open/kodeverk', {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                        },
                        cache: 'no-cache',
                    })

                    if (!response.ok) {
                        return NextResponse.json(
                            { message: `Kunne ikke hente kodeverk (${response.status})` },
                            { status: response.status },
                        )
                    }

                    const data: Kodeverk = await response.json()
                    return NextResponse.json(data)
                } catch (error) {
                    return NextResponse.json(
                        { message: 'Feil ved henting av kodeverk fra ekstern tjeneste' },
                        { status: 500 },
                    )
                }
            }

            return Promise.resolve(NextResponse.json(kodeverk))
        },
    )
}
