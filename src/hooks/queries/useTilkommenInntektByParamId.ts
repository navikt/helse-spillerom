import { useTilkommenInntektById } from '@hooks/queries/useTilkommenInntektById'
import { usePersonSaksbehandlingsperiodeTilkommenInntektRouteParams } from '@hooks/useRouteParams'

export function useTilkommenInntektByParamId() {
    const { behandlingId, tilkommenId } = usePersonSaksbehandlingsperiodeTilkommenInntektRouteParams()

    return useTilkommenInntektById(behandlingId, tilkommenId)
}
