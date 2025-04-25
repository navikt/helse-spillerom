import { NextResponse } from 'next/server'

import { ErrorResponse } from '@/auth/beskyttetApi'

export async function POST(): Promise<NextResponse<PersonsøkRespons | ErrorResponse>> {
    return NextResponse.json({ spilleromId: '123' })
}

interface PersonsøkRespons {
    spilleromId: string
}
