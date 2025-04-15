import { hentPerson } from '@/backend/personer'

export async function GET(request: Request, { params }: { params: Promise<{ aktorid: string }> }) {
    const slug = await params

    return Response.json(hentPerson(slug.aktorid)?.soknader || [])
}
