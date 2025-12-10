import { useParams } from 'next/navigation'

export interface PersonRouteParams {
    personId: string
}

export interface PersonBehandlingRouteParams extends PersonRouteParams {
    behandlingId: string
}

export interface PersonBehandlingTilkommenInntektRouteParams extends PersonBehandlingRouteParams {
    tilkommenId: string
}

export interface PersonSoknadRouteParams extends PersonRouteParams {
    soknadId: string
}

export function useRouteParams(): PersonBehandlingRouteParams {
    const params = useParams()
    return {
        personId: params.personId as string,
        behandlingId: params.behandlingId as string,
    }
}

export function usePersonRouteParams(): PersonRouteParams {
    const params = useParams()
    return {
        personId: params.personId as string,
    }
}

export function usePersonBehandlingTilkommenInntektRouteParams(): PersonBehandlingTilkommenInntektRouteParams {
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
