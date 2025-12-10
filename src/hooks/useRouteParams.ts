import { useParams } from 'next/navigation'

/**
 * Type-safe route parameters for person routes
 */
export interface PersonRouteParams {
    personId: string
}

export interface PersonSaksbehandlingsperiodeRouteParams extends PersonRouteParams {
    saksbehandlingsperiodeId: string
}

export interface PersonSaksbehandlingsperiodeTilkommenInntektRouteParams extends PersonSaksbehandlingsperiodeRouteParams {
    tilkommenId: string
}

export interface PersonSoknadRouteParams extends PersonRouteParams {
    soknadId: string
}

/**
 * Type-safe wrapper for useParams() som gir typed output
 *
 * Bruk denne i stedet for useParams() direkte for å få type-sikkerhet.
 *
 * @example
 * ```ts
 * const { personId, saksbehandlingsperiodeId } = useRouteParams()
 * // personId og saksbehandlingsperiodeId er nå typet som string, ikke string | string[] | undefined
 * ```
 */
export function useRouteParams(): PersonSaksbehandlingsperiodeRouteParams {
    const params = useParams()
    return {
        personId: params.personId as string,
        saksbehandlingsperiodeId: params.saksbehandlingsperiodeId as string,
    }
}

/**
 * Type-safe hook for routes som kun har personId
 */
export function usePersonRouteParams(): PersonRouteParams {
    const params = useParams()
    return {
        personId: params.personId as string,
    }
}

/**
 * Type-safe hook for routes med personId og saksbehandlingsperiodeId
 */
export function usePersonSaksbehandlingsperiodeRouteParams(): PersonSaksbehandlingsperiodeRouteParams {
    const params = useParams()
    return {
        personId: params.personId as string,
        saksbehandlingsperiodeId: params.saksbehandlingsperiodeId as string,
    }
}

/**
 * Type-safe hook for routes med personId, saksbehandlingsperiodeId og tilkommenId
 */
export function usePersonSaksbehandlingsperiodeTilkommenInntektRouteParams(): PersonSaksbehandlingsperiodeTilkommenInntektRouteParams {
    const params = useParams()
    return {
        personId: params.personId as string,
        saksbehandlingsperiodeId: params.saksbehandlingsperiodeId as string,
        tilkommenId: params.tilkommenId as string,
    }
}

/**
 * Type-safe hook for routes med personId og soknadId
 */
export function usePersonSoknadRouteParams(): PersonSoknadRouteParams {
    const params = useParams()
    return {
        personId: params.personId as string,
        soknadId: params.soknadId as string,
    }
}
