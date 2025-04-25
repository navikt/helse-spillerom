import { NextResponse } from 'next/server'

import { ErrorResponse } from '@/auth/beskyttetApi'
import { Personinfo } from '@/schemas/personinfo'

export async function GET(): Promise<NextResponse<Personinfo | ErrorResponse>> {
    return NextResponse.json({
        fødselsnummer: '62345678906',
        aktørId: '123',
        navn: 'Ting Tang',
        alder: 33,
    })
}
