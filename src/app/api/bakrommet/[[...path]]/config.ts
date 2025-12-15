export const allowedAPIs = [
    'GET /v1/bruker',
    'GET /v1/behandlinger',
    'GET /v1/[uuid]/personinfo',
    'GET /v1/[uuid]/soknader',
    'POST /v1/personsok',
    'GET /v1/organisasjon/[orgnummer]',
    'GET /v1/[uuid]/behandlinger',
    'POST /v1/[uuid]/behandlinger',
    'GET /v1/[uuid]/inntektsmeldinger',
    'GET /v1/[uuid]/behandlinger/[uuid]/utbetalingsberegning',
    'GET /v1/[uuid]/behandlinger/[uuid]/dokumenter',
    'POST /v1/[uuid]/behandlinger/[uuid]/dokumenter/ainntekt/hent-8-28',
    'POST /v1/[uuid]/behandlinger/[uuid]/dokumenter/ainntekt/hent-8-30',
    'POST /v1/[uuid]/behandlinger/[uuid]/dokumenter/arbeidsforhold/hent',
    'POST /v1/[uuid]/behandlinger/[uuid]/dokumenter/pensjonsgivendeinntekt/hent',
    'GET /v1/[uuid]/behandlinger/[uuid]/vilkaarsvurdering',
    'PUT /v1/[uuid]/behandlinger/[uuid]/vilkaarsvurdering/[kode]',
    'DELETE /v1/[uuid]/behandlinger/[uuid]/vilkaarsvurdering/[kode]',
    'GET /v1/[uuid]/behandlinger/[uuid]/yrkesaktivitet',
    'POST /v1/[uuid]/behandlinger/[uuid]/yrkesaktivitet',
    'PUT /v1/[uuid]/behandlinger/[uuid]/yrkesaktivitet/[uuid]/kategorisering',
    'DELETE /v1/[uuid]/behandlinger/[uuid]/yrkesaktivitet/[uuid]',
    'PUT /v1/[uuid]/behandlinger/[uuid]/yrkesaktivitet/[uuid]/dagoversikt',
    'PUT /v1/[uuid]/behandlinger/[uuid]/yrkesaktivitet/[uuid]/perioder',
    'PUT /v1/[uuid]/behandlinger/[uuid]/yrkesaktivitet/[uuid]/inntekt',
    'PUT /v1/[uuid]/behandlinger/[uuid]/yrkesaktivitet/[uuid]/fri-inntekt',
    'PUT /v1/[uuid]/behandlinger/[uuid]/yrkesaktivitet/[uuid]/refusjon',
    'GET /v1/[uuid]/soknader/[uuid]',
    'POST /v1/[uuid]/behandlinger/[uuid]/sendtilbeslutning',
    'POST /v1/[uuid]/behandlinger/[uuid]/tatilbeslutning',
    'POST /v1/[uuid]/behandlinger/[uuid]/sendtilbake',
    'POST /v1/[uuid]/behandlinger/[uuid]/godkjenn',
    'POST /v1/[uuid]/behandlinger/[uuid]/revurder',
    'GET /v1/[uuid]/behandlinger/[uuid]/historikk',
    'GET /v2/[uuid]/behandlinger/[uuid]/sykepengegrunnlag',
    'POST /v2/[uuid]/behandlinger/[uuid]/sykepengegrunnlag',
    'DELETE /v2/[uuid]/behandlinger/[uuid]/sykepengegrunnlag',
    'PUT /v1/[uuid]/behandlinger/[uuid]/skjaeringstidspunkt',
    'GET /v1/[uuid]/behandlinger/[uuid]/yrkesaktivitet/[uuid]/inntektsmeldinger',
    'GET /v1/[uuid]/behandlinger/[uuid]/yrkesaktivitet/[uuid]/pensjonsgivendeinntekt',
    'GET /v1/[uuid]/behandlinger/[uuid]/yrkesaktivitet/[uuid]/ainntekt',
    'GET /v1/[uuid]/behandlinger/[uuid]/validering',
    'GET /v1/[uuid]/behandlinger/[uuid]/tilkommeninntekt',
    'POST /v1/[uuid]/behandlinger/[uuid]/tilkommeninntekt',
    'PUT /v1/[uuid]/behandlinger/[uuid]/tilkommeninntekt/[uuid]',
    'DELETE /v1/[uuid]/behandlinger/[uuid]/tilkommeninntekt/[uuid]',
    'GET /v2/[uuid]/tidslinje',
]

export const allowedDemoAPIs = [
    'GET /v1/demo/brukere',
    'POST /v1/demo/bruker',
    'GET /v1/demo/scenarioer',
    'GET /v1/demo/testpersoner',
    'POST /v1/demo/session/nullstill',
    'GET /v1/demo/kafkaoutbox',
]

const UUID = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g
// Matcher 9-sifret orgnummer i organisasjon-endepunkt
const ORGNUMMER = /\/v1\/organisasjon\/(\d{9})/g

export function cleanPath(value: string): string {
    if (!value) return value

    // Sjekk først om det er et direkte treff i allowedAPIs eller allowedDemoAPIs
    const allAllowedAPIs = [...allowedAPIs, ...allowedDemoAPIs]
    if (allAllowedAPIs.includes(value)) {
        return value
    }

    // Erstatter UUID først
    let cleanedPath = value.replace(UUID, '[uuid]')
    // Deretter erstatter orgnummer (9 siffer) i organisasjon-endepunkt
    cleanedPath = cleanedPath.replace(ORGNUMMER, '/v1/organisasjon/[orgnummer]')

    const parts = cleanedPath.split('/')
    const isVilkaarModification = cleanedPath.startsWith('PUT') || cleanedPath.startsWith('DELETE')
    const hasEnoughParts = parts.length == 7
    const secondLastIsVilkaar = parts[parts.length - 2] === 'vilkaarsvurdering'
    const thirdLastIsUuid = parts[parts.length - 3] === '[uuid]'

    const isVilkaarEndpoint = isVilkaarModification && hasEnoughParts && secondLastIsVilkaar && thirdLastIsUuid

    if (isVilkaarEndpoint) {
        // Remove the last part (the kode) and append [kode]
        parts.pop()
        cleanedPath = parts.join('/') + '/[kode]'
    }

    return cleanedPath
}
