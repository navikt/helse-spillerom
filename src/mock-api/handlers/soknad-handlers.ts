import { NextResponse } from 'next/server'

import { finnPerson } from '@/mock-api/testpersoner/testpersoner'
import { Søknad } from '@/schemas/søknad'

export async function handleGetSoknader(request: Request, personIdFraRequest: string): Promise<Response> {
    const url = new URL(request.url)
    const fom = url.searchParams.get('fom')
    const soknader: Søknad[] = finnPerson(personIdFraRequest)?.soknader || []

    return NextResponse.json(
        soknader.filter((soknad) => {
            // soknad fom er lik eller større enn fom
            if (!fom) return true
            const fomDate = new Date(fom)
            const soknadFomDate = new Date(soknad.fom!)
            return soknadFomDate >= fomDate
        }),
    )
}
