import { hentDagoversikt } from '@/backend/mockdata'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ aktorid: string; behandlingId: string; inntektId: string }> },
) {
    const slug = await params
    const inntektid = slug.inntektId
    return Response.json(hentDagoversikt(inntektid))
}
