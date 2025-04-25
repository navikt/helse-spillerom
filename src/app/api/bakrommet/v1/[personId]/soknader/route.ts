import { NextResponse } from 'next/server'

import { ErrorResponse } from '@/auth/beskyttetApi'

export async function GET(): Promise<NextResponse<SøknaderRespons[] | ErrorResponse>> {
    return NextResponse.json([{ id: '1' }, { id: '2' }])
}

interface SøknaderRespons {
    id: string
}
