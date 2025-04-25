import { NextResponse } from 'next/server'

import { ErrorResponse } from '@/auth/beskyttetApi'
import { PersonId } from '@/schemas/personsøk'

export async function POST(): Promise<NextResponse<PersonId | ErrorResponse>> {
    return NextResponse.json({ personId: '1234567891011' })
}
