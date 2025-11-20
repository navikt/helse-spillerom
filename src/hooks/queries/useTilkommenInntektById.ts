import { useTilkommenInntekt } from '@hooks/queries/useTilkommenInntekt'

export function useTilkommenInntektById(behandlingId: string, tilkommenInntektId: string) {
    const { data, isLoading } = useTilkommenInntekt(behandlingId)
    return {
        tilkommenInntekt: data?.find((inntekt) => inntekt.id === tilkommenInntektId),
        isLoading,
    }
}
