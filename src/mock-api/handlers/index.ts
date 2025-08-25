// Re-export all handlers for easier imports
export * from './person-handlers'
export * from './saksbehandlingsperiode-handlers'
export * from './soknad-handlers'
export * from './vilkaar-handlers'
import { handleGetAinntekt } from './ainntekt-handlers'
import { handleGetArbeidsforhold } from './arbeidsforhold-handlers'
import { handleGetPensjonsgivendeInntekt } from './pensjonsgivende-inntekt-handlers'

type HandlerParams = {
    params: {
        personId: string
    }
}

export const handlers = [
    {
        path: '/api/bakrommet/v1/:personId/arbeidsforhold',
        method: 'GET',
        handler: ({ params }: HandlerParams) => handleGetArbeidsforhold(params.personId),
    },
    {
        path: '/api/bakrommet/v1/:personId/ainntekt',
        method: 'GET',
        handler: ({ params }: HandlerParams) => handleGetAinntekt(params.personId),
    },
    {
        path: '/api/bakrommet/v1/:personId/pensjonsgivendeinntekt',
        method: 'GET',
        handler: ({ params }: HandlerParams) => handleGetPensjonsgivendeInntekt(params.personId),
    },
]
