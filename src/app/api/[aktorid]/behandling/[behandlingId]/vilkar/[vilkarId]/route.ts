import { lagreVilkaar, slettVilkaar } from '@/backend/mockdata'
import { Vilkarsvurdering } from '@typer/manuellbehandlingtypes'

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ aktorid: string; behandlingId: string; vilkarId: string }> },
) {
    const slug = await params

    slettVilkaar(slug.vilkarId)
    return Response.json({})
}

export async function PUT(request: Request) {
    const req: Vilkarsvurdering = await request.json()

    lagreVilkaar(req)
    return Response.json(req)
}
