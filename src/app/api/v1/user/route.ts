import { NextResponse } from 'next/server'

import { beskyttetApi, ErrorResponse } from '@/auth/beskyttetApi'

export async function GET(request: Request): Promise<NextResponse<Bruker | ErrorResponse>> {
    return await beskyttetApi<Bruker>(request, (payload): NextResponse<Bruker> => {
        return NextResponse.json({ navn: 'pong', navIdent: payload.NAVident!, payload })
    })
}

interface Bruker {
    navn: string
    navIdent: string
}
