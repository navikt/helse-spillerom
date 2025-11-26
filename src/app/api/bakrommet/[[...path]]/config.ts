export const allowedAPIs = [
    'GET /v1/bruker',
    'GET /v1/saksbehandlingsperioder',
    'GET /v1/[personId]/personinfo',
    'GET /v1/[personId]/soknader',
    'POST /v1/personsok',
    'GET /v1/organisasjon/[orgnummer]',
    'GET /v1/[personId]/saksbehandlingsperioder',
    'POST /v1/[personId]/saksbehandlingsperioder',
    'GET /v1/[personId]/inntektsmeldinger',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/utbetalingsberegning',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/dokumenter',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/dokumenter/ainntekt/hent-8-28',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/dokumenter/ainntekt/hent-8-30',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/dokumenter/arbeidsforhold/hent',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/dokumenter/pensjonsgivendeinntekt/hent',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaarsvurdering',
    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaarsvurdering/[kode]',
    'DELETE /v1/[personId]/saksbehandlingsperioder/[uuid]/vilkaarsvurdering/[kode]',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet',
    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/kategorisering',
    'DELETE /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]',
    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/dagoversikt',
    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/perioder',
    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/inntekt',
    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/fri-inntekt',
    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/refusjon',
    'GET /v1/[personId]/soknader/[uuid]',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/sendtilbeslutning',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/tatilbeslutning',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/sendtilbake',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/godkjenn',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/revurder',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/historikk',
    'GET /v2/[personId]/saksbehandlingsperioder/[uuid]/sykepengegrunnlag',
    'POST /v2/[personId]/saksbehandlingsperioder/[uuid]/sykepengegrunnlag',
    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/skjaeringstidspunkt',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/inntektsmeldinger',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/pensjonsgivendeinntekt',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/yrkesaktivitet/[uuid]/ainntekt',
    'GET /v1/[personId]/saksbehandlingsperioder/[uuid]/tilkommeninntekt',
    'POST /v1/[personId]/saksbehandlingsperioder/[uuid]/tilkommeninntekt',
    'PUT /v1/[personId]/saksbehandlingsperioder/[uuid]/tilkommeninntekt/[uuid]',
    'DELETE /v1/[personId]/saksbehandlingsperioder/[uuid]/tilkommeninntekt/[uuid]',
    'GET /v1/[personId]/tidslinje',
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
// Kjente path-segmenter som ikke skal matche som person-ID
const KNOWN_PATH_SEGMENTS = [
    'demo',
    'bruker',
    'brukere',
    'saksbehandlingsperioder',
    'personsok',
    'organisasjon',
    'scenarioer',
    'testpersoner',
    'tilkommeninntekt',
]
// Matcher person-ID kun når den er i riktig kontekst: etter /v1/ eller /v2/, og ikke et kjent path-segment
const PERSONID = /(\/v[12]\/)([a-z0-9-]{5,50})(\/|$|\s)/g

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
    // Deretter erstatter person-ID kun i riktig kontekst (etter /v1/ eller /v2/), men ikke kjente segmenter
    cleanedPath = cleanedPath.replace(PERSONID, (match, prefix, personId, suffix) => {
        // Sjekk om det matchede segmentet allerede er en placeholder eller et kjent path-segment
        if (personId.startsWith('[') || KNOWN_PATH_SEGMENTS.includes(personId)) {
            return match // Returner uendret hvis det er en placeholder eller kjent segment
        }
        return `${prefix}[personId]${suffix}`
    })

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
