import { useTilkommenInntektById } from '@hooks/queries/useTilkommenInntektById'
import { usePersonSaksbehandlingsperiodeTilkommenInntektRouteParams } from '@hooks/useRouteParams'

export function useTilkommenInntektByParamId() {
    const { saksbehandlingsperiodeId, tilkommenId } = usePersonSaksbehandlingsperiodeTilkommenInntektRouteParams()

    return useTilkommenInntektById(saksbehandlingsperiodeId, tilkommenId)
}
