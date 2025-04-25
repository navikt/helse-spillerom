import { NextResponse } from 'next/server'

import { ErrorResponse } from '@/auth/beskyttetApi'
import { Personinfo } from '@/schemas/personinfo'

export async function GET(): Promise<NextResponse<Personinfo | ErrorResponse>> {
    return NextResponse.json({
        fødselsnummer: '62345678906',
        aktørId: '1234567891011',
        navn: 'Kalle Kranfører',
        alder: 47,
    })
}
