import { useParams } from 'next/navigation'

/**
 * Type-safe route parameters for person routes
 */
export interface PersonRouteParams {
    personId: string
}

export interface PersonSaksbehandlingsperiodeRouteParams extends PersonRouteParams {
    behandlingId: string
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
 * const { personId, behandlingId } = useRouteParams()
 * // personId og behandlingId er nå typet som string, ikke string | string[] | undefined
 * ```
 */
export function useRouteParams(): PersonSaksbehandlingsperiodeRouteParams {
    const params = useParams()
    return {
        personId: params.personId as string,
        behandlingId: params.behandlingId as string,
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
 * Type-safe hook for routes med personId og behandlingId
 */
export function usePersonSaksbehandlingsperiodeRouteParams(): PersonSaksbehandlingsperiodeRouteParams {
    const params = useParams()
    return {
        personId: params.personId as string,
        behandlingId: params.behandlingId as string,
    }
}

/**
 * Type-safe hook for routes med personId, behandlingId og tilkommenId
 */
export function usePersonSaksbehandlingsperiodeTilkommenInntektRouteParams(): PersonSaksbehandlingsperiodeTilkommenInntektRouteParams {
    const params = useParams()
    return {
        personId: params.personId as string,
        behandlingId: params.behandlingId as string,
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
