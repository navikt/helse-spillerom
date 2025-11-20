import { useParams } from 'next/navigation'

import { useTilkommenInntektById } from '@hooks/queries/useTilkommenInntektById'

export function useTilkommenInntektByParamId() {
    const params = useParams()
    const behandlingId = params.saksbehandlingsperiodeId as string
    const tilkommenInntektId = params.tilkommenId as string

    return useTilkommenInntektById(behandlingId, tilkommenInntektId)
}
