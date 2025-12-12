import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Yrkesaktivitet, yrkesaktivitetSchema } from '@schemas/yrkesaktivitet'
import { useAktivBehandlingMedLoading } from '@hooks/queries/useAktivBehandling'
import { SykepengegrunnlagResponse, sykepengegrunnlagResponseSchema } from '@schemas/sykepengegrunnlag'
import { queryKeys } from '@utils/queryKeys'
import { usePersonRouteParams } from '@hooks/useRouteParams'
import { sortByOrgnavn } from '@hooks/queries/useYrkesaktivitet'

export function useYrkesaktivitetForSykepengegrunnlag() {
    const { pseudoId } = usePersonRouteParams()
    const params = useParams() // Brukes kun for behandlingId som kan være undefined
    const router = useRouter()
    const { aktivBehandling } = useAktivBehandlingMedLoading()

    const sykepengegrunnlag = useQuery<SykepengegrunnlagResponse | null, ProblemDetailsError>({
        queryKey: queryKeys.sykepengegrunnlag(pseudoId, aktivBehandling?.id ?? ''),
        queryFn: async (): Promise<SykepengegrunnlagResponse | null> => {
            if (!pseudoId || !aktivBehandling?.id) {
                throw new Error('PersonId og behandlingId må være tilstede')
            }

            return await fetchAndParse(
                `/api/bakrommet/v2/${pseudoId}/behandlinger/${aktivBehandling?.id}/sykepengegrunnlag`,
                sykepengegrunnlagResponseSchema.nullable(),
            )
        },
        enabled: !!pseudoId && !!aktivBehandling?.id,
        staleTime: 5 * 60 * 1000, // 5 minutter
    })

    const harOpprettetForBehandlingFraSykepengegrunnlag = sykepengegrunnlag.data?.opprettetForBehandling
    const behandlingIdFraUrl = params.behandlingId as string | undefined
    const behandlingIdForYrkesaktivitet = harOpprettetForBehandlingFraSykepengegrunnlag ?? behandlingIdFraUrl

    const harBehandlingId = !!behandlingIdForYrkesaktivitet
    const sykepengegrunnlagErFerdigLastet = !sykepengegrunnlag.isLoading
    const sykepengegrunnlagHarData = sykepengegrunnlag.isSuccess
        ? sykepengegrunnlag.data?.sykepengegrunnlag !== null
        : true

    const yrkesaktivitetFetchEnabled =
        !!pseudoId && harBehandlingId && sykepengegrunnlagErFerdigLastet && sykepengegrunnlagHarData

    const query = useQuery<Yrkesaktivitet[], ProblemDetailsError>({
        queryKey: queryKeys.yrkesaktivitet(pseudoId, behandlingIdForYrkesaktivitet ?? ''),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingIdForYrkesaktivitet}/yrkesaktivitet`,
                z.array(yrkesaktivitetSchema),
            ),
        select: sortByOrgnavn,
        enabled: yrkesaktivitetFetchEnabled,
    })

    useEffect(() => {
        if (query.error && query.error.problem?.status === 404) {
            // Naviger til rot-nivået hvis API-et returnerer 404
            router.push('/')
        }
    }, [query.error, router])

    return query
}
