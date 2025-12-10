import { useParams } from 'next/navigation'

export interface PersonRouteParams {
    pseudoId: string
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
        pseudoId: params.pseudoId as string,
        behandlingId: params.behandlingId as string,
    }
}

export function usePersonRouteParams(): PersonRouteParams {
    const params = useParams()
    return {
        pseudoId: params.pseudoId as string,
    }
}

export function usePersonBehandlingTilkommenInntektRouteParams(): PersonBehandlingTilkommenInntektRouteParams {
    const params = useParams()
    return {
        pseudoId: params.pseudoId as string,
        behandlingId: params.behandlingId as string,
        tilkommenId: params.tilkommenId as string,
    }
}

export function usePersonSoknadRouteParams(): PersonSoknadRouteParams {
    const params = useParams()
    return {
        pseudoId: params.pseudoId as string,
        soknadId: params.soknadId as string,
    }
}
