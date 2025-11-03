import { NextResponse } from 'next/server'

import { ErrorResponse } from '@/auth/beskyttetApi'
import { erDevLokalEllerDemo } from '@/env'
import { getSession, Person } from '@/mock-api/session'

export async function GET(): Promise<NextResponse<Person[] | ErrorResponse>> {
    if (erDevLokalEllerDemo) {
        const session = await getSession()

        const testPersoner = session.testpersoner
        return NextResponse.json(testPersoner)
    }
    return NextResponse.json(
        {
            message: 'Not found',
        },
        { status: 404 },
    )
}
