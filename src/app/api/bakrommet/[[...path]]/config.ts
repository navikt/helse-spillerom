export const allowedAPIs = [
    'GET /v1/[personId]/personinfo',
    'GET /v1/[personId]/soknader',
    'GET /v1/[personId]/dokumenter',
    'POST /v1/personsok',
    'GET /v1/[personId]/saksbehandlingsperioder',
    'POST /v1/[personId]/saksbehandlingsperioder',
    'GET /v1/[personId]/arbeidsforhold',
]

const UUID = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g
const PERSONID = /\b[a-z0-9]{5}\b/g

export function cleanPath(value: string): string {
    return value?.replace(UUID, '[uuid]').replace(PERSONID, '[personId]')
}
