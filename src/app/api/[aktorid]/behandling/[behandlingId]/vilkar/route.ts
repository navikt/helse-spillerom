import { v4 } from 'uuid'

import { NyVilkarsvurdering } from '@typer/manuellbehandlingtypes'
import { hentVilkaarForBehandling, lagreVilkaar, slettVilkaar } from '@/backend/mockdata'

export async function POST(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ aktorid: string; behandlingId: string }>
    },
) {
    const req: NyVilkarsvurdering = await request.json()
    const slug = await params

    const vilkaar = {
        id: v4(),
        regelId: req.regelId,
        behandlingId: slug.behandlingId,
        vurdering: undefined,
    }
    lagreVilkaar(vilkaar)
    return Response.json(vilkaar)
}

export async function PUT(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ aktorid: string; behandlingId: string }>
    },
) {
    const req: string[] = await request.json()
    const slug = await params

    const eksisterendeVilkaar = hentVilkaarForBehandling(slug.behandlingId)
    eksisterendeVilkaar.forEach((v) => {
        if (!req.includes(v.regelId)) {
            slettVilkaar(v.id)
        }
    })
    const eksiterendeRegelId = eksisterendeVilkaar.map((v) => v.regelId)
    req.forEach((r) => {
        if (!eksiterendeRegelId.includes(r)) {
            lagreVilkaar({
                id: v4(),
                regelId: r,
                behandlingId: slug.behandlingId,
                vurdering: undefined,
            })
        }
    })

    return Response.json(hentVilkaarForBehandling(slug.behandlingId))
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ aktorid: string; behandlingId: string }> },
) {
    const slug = await params

    return Response.json(hentVilkaarForBehandling(slug.behandlingId))
}
