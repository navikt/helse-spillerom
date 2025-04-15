import { v4 } from 'uuid'

import { Behandling } from '@typer/manuellbehandlingtypes'
import { hentPaaAktorid, lagreBehandling, lagreInntekt } from '@/backend/mockdata'
import { hentPerson } from '@/backend/personer'

export async function POST(request: Request, { params }: { params: Promise<{ aktorid: string }> }) {
    const req = await request.json()
    const slug = await params

    const behandling: Behandling = {
        id: v4(),
        fom: req.fom,
        tom: req.tom,
        aktorid: slug.aktorid,
        skjaring: req.skjaring,
        soknadIder: req.soknadIder,
    }
    lagreBehandling(behandling)
    const seenInntekt = new Set()
    req.soknadIder.forEach((soknadId: string) => {
        const soknad = hentPerson(slug.aktorid)?.soknader?.find((soknad) => soknad.id === soknadId)

        if (soknad) {
            const inntektKey = `${soknad.arbeidsgiver?.orgnummer}-${soknad.arbeidssituasjon}`
            if (seenInntekt.has(inntektKey)) {
                return
            }
            seenInntekt.add(inntektKey)
            const inntekt = {
                id: v4(),
                sykmeldt: true,
                behandlingId: behandling.id,
                inntektstype: soknad.arbeidssituasjon,
                orgnavn: soknad.arbeidsgiver?.navn,
                orgnummer: soknad.arbeidsgiver?.orgnummer,
            }
            lagreInntekt(inntekt)
        }
    })

    return Response.json(behandling)
}

export async function GET(request: Request, { params }: { params: Promise<{ aktorid: string }> }) {
    const slug = await params

    return Response.json(hentPaaAktorid(slug.aktorid))
}
