export const allowedAPIs = [
    'GET /v1/[personId]/personinfo',
    'GET /v1/[personId]/soknader',
    'GET /v1/[personId]/dokumenter',
    'POST /v1/personsok',
    'GET /v1/[personId]/saksbehandlingsperioder',
    'POST /v1/[personId]/saksbehandlingsperioder',
    'GET /v1/[personId]/arbeidsforhold',
    'GET /v1/[personId]/ainntekt',
    'GET /v1/[personId]/inntektsmeldinger',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaar',
    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaar/[kode]',
]

const UUID = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g
const PERSONID = /\b[a-z0-9]{5}\b/g

export function cleanPath(value: string): string {
    if (!value) return value

    let cleanedPath = value.replace(UUID, '[uuid]').replace(PERSONID, '[personId]')

    const parts = cleanedPath.split('/')
    const startsWithPut = cleanedPath.startsWith('PUT')
    const hasEnoughParts = parts.length == 7
    const secondLastIsVilkaar = parts[parts.length - 2] === 'vilkaar'
    const thirdLastIsUuid = parts[parts.length - 3] === '[uuid]'

    const isPutVilkaarEndpoint = startsWithPut && hasEnoughParts && secondLastIsVilkaar && thirdLastIsUuid

    if (isPutVilkaarEndpoint) {
        // Remove the last part (the kode) and append [kode]
        parts.pop()
        cleanedPath = parts.join('/') + '/[kode]'
    }

    return cleanedPath
}
