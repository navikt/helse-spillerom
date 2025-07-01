export const allowedAPIs = [
    'GET /v1/[personId]/personinfo',
    'GET /v1/[personId]/soknader',
    'POST /v1/personsok',
    'GET /v1/[personId]/saksbehandlingsperioder',
    'POST /v1/[personId]/saksbehandlingsperioder',
    'GET /v1/[personId]/arbeidsforhold',
    'GET /v1/[personId]/ainntekt',
    'GET /v1/[personId]/inntektsmeldinger',
    'GET /v1/[personId]/pensjonsgivendeinntekt',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/dokumenter',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/dokumenter/ainntekt/hent',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/dokumenter/arbeidsforhold/hent',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaar',
    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaar/[kode]',
    'DELETE /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaar/[kode]',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold',
    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold/[uuid]/kategorisering',
    'DELETE /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold/[uuid]',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/inntektsforhold/[uuid]/dagoversikt',
    'GET /v1/[personId]/soknader/[uuid]',
]

const UUID = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g
const PERSONID = /\b[a-z0-9]{5}\b/g

export function cleanPath(value: string): string {
    if (!value) return value

    let cleanedPath = value.replace(UUID, '[uuid]').replace(PERSONID, '[personId]')

    const parts = cleanedPath.split('/')
    const isVilkaarModification = cleanedPath.startsWith('PUT') || cleanedPath.startsWith('DELETE')
    const hasEnoughParts = parts.length == 7
    const secondLastIsVilkaar = parts[parts.length - 2] === 'vilkaar'
    const thirdLastIsUuid = parts[parts.length - 3] === '[uuid]'

    const isVilkaarEndpoint = isVilkaarModification && hasEnoughParts && secondLastIsVilkaar && thirdLastIsUuid

    if (isVilkaarEndpoint) {
        // Remove the last part (the kode) and append [kode]
        parts.pop()
        cleanedPath = parts.join('/') + '/[kode]'
    }

    return cleanedPath
}
