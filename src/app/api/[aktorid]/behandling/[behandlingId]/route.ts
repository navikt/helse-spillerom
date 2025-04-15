import { hentBehandling, lagreBehandling } from '@/backend/mockdata'

export async function GET(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ aktorid: string; behandlingId: string }>
    },
) {
    const slug = await params

    const data = hentBehandling(slug.behandlingId)
    if (!data) {
        return Response.json({ code: 'not_found' }, { status: 404 })
    }
    return Response.json(data)
}

export async function PUT(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ aktorid: string; behandlingId: string }>
    },
) {
    const slug = await params
    const req = await request.json()
    const data = hentBehandling(slug.behandlingId)
    if (!data) {
        return Response.json({ code: 'not_found' }, { status: 404 })
    }
    Object.assign(data, req)
    lagreBehandling(data)
    return Response.json(data)
}
