import { useTilkommenInntektById } from '@hooks/queries/useTilkommenInntektById'
import { usePersonBehandlingTilkommenInntektRouteParams } from '@hooks/useRouteParams'

export function useTilkommenInntektByParamId() {
    const { behandlingId, tilkommenId } = usePersonBehandlingTilkommenInntektRouteParams()

    return useTilkommenInntektById(behandlingId, tilkommenId)
}
