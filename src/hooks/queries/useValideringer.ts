import { useQuery } from '@tanstack/react-query'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { queryKeys } from '@utils/queryKeys'
import { useRouteParams } from '@hooks/useRouteParams'
import { Validering, valideringSchema } from '@schemas/validering'

export function useValideringer() {
    const { pseudoId, behandlingId } = useRouteParams()

    return useQuery<Validering[], Error>({
        queryKey: queryKeys.valideringer(pseudoId, behandlingId),
        queryFn: () => {
            if (1 < 2) {
                return [
                    {
                        id: '123e4567-e89b-12d3-a456-426614174000',
                        tekst: 'Dette er en valideringsmelding.',
                    },
                    {
                        id: '123e4567-e89b-12d3-a456-426614174001',
                        tekst: 'Dette er enda en valideringsmelding.',
                    },
                ]
            }

            return fetchAndParse(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/validering`,
                z.array(valideringSchema),
            )
        },
        enabled: Boolean(pseudoId && behandlingId),
    })
}
