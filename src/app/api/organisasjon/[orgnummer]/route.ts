import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@navikt/next-logger'

import { ProblemDetails } from '@/schemas/problemDetails'
import { organisasjonsnavnMap } from '@/utils/organisasjoner'
import { erLokalEllerDemo, getServerEnv } from '@/env'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orgnummer: string }> },
): Promise<NextResponse<string | ProblemDetails>> {
    const { orgnummer } = await params

    // 1) I lokal/demo (mock) skal vi kun bruke lokalt map
    if (erLokalEllerDemo) {
        const navn = organisasjonsnavnMap[orgnummer]
        if (navn) return NextResponse.json(navn)
        const problemDetails: ProblemDetails = {
            type: 'about:blank',
            title: 'Organisasjon ikke funnet',
            status: 404,
            detail: `Fant ikke organisasjonsnavn for organisasjonsnummer ${orgnummer}`,
            instance: `/api/organisasjon/${orgnummer}`,
        }
        return NextResponse.json(problemDetails, { status: 404 })
    }

    // 2) I øvrige miljøer: kall EREG først
    try {
        const { EREG_SERVICES_BASE_URL } = getServerEnv()
        if (!EREG_SERVICES_BASE_URL) {
            logger.error('Mangler EREG_SERVICES_BASE_URL i miljøvariabler')
            const problemDetails: ProblemDetails = {
                type: 'about:blank',
                title: 'Konfigurasjonsfeil',
                status: 500,
                detail: 'Mangler base-URL for EREG i miljøet',
                instance: `/api/organisasjon/${orgnummer}`,
            }
            return NextResponse.json(problemDetails, { status: 500 })
        }

        const url = `${EREG_SERVICES_BASE_URL}/v2/organisasjon/${orgnummer}/noekkelinfo`
        const res = await fetch(url, { method: 'GET' })
        if (res.ok) {
            const data = (await res.json()) as { navn?: { sammensattnavn?: string; navnelinje1?: string } }
            const navnFraEreg = data.navn?.sammensattnavn ?? data.navn?.navnelinje1
            if (navnFraEreg) return NextResponse.json(navnFraEreg)
            // Mangler navn i respons -> 404
            const problemDetails: ProblemDetails = {
                type: 'about:blank',
                title: 'Organisasjon ikke funnet',
                status: 404,
                detail: `Fant ikke navn for organisasjonsnummer ${orgnummer}`,
                instance: `/api/organisasjon/${orgnummer}`,
            }
            return NextResponse.json(problemDetails, { status: 404 })
        }
        if (res.status === 404) {
            const problemDetails: ProblemDetails = {
                type: 'about:blank',
                title: 'Organisasjon ikke funnet',
                status: 404,
                detail: `Fant ikke organisasjon i EREG for organisasjonsnummer ${orgnummer}`,
                instance: `/api/organisasjon/${orgnummer}`,
            }
            return NextResponse.json(problemDetails, { status: 404 })
        }
        logger.error(`EREG kall feilet med status=${res.status} for org=${orgnummer}`)
        const problemDetails: ProblemDetails = {
            type: 'about:blank',
            title: 'Ukjent feil ved oppslag',
            status: 500,
            detail: `Klarte ikke slå opp organisasjon i EREG (status ${res.status})`,
            instance: `/api/organisasjon/${orgnummer}`,
        }
        return NextResponse.json(problemDetails, { status: 500 })
    } catch (e) {
        logger.error(e)
        const problemDetails: ProblemDetails = {
            type: 'about:blank',
            title: 'Ukjent feil ved oppslag',
            status: 500,
            detail: 'Klarte ikke slå opp organisasjon i EREG',
            instance: `/api/organisasjon/${orgnummer}`,
        }
        return NextResponse.json(problemDetails, { status: 500 })
    }

    // Unreachable, men beholdt for typesikkerhet
}
