import { Vilkarsvurdering } from '@typer/manuellbehandlingtypes'
import { lagreVilkaar, slettVilkaar } from '@/backend/mockdata'

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
