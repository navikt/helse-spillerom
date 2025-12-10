import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { z } from 'zod/v4'
import { useParams } from 'next/navigation'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Yrkesaktivitet, yrkesaktivitetSchema } from '@schemas/yrkesaktivitet'
import { useAktivSaksbehandlingsperiodeMedLoading } from '@hooks/queries/useAktivSaksbehandlingsperiode'
import { SykepengegrunnlagResponse, sykepengegrunnlagResponseSchema } from '@schemas/sykepengegrunnlag'
import { queryKeys } from '@utils/queryKeys'
import { usePersonRouteParams } from '@hooks/useRouteParams'

export function useYrkesaktivitetForSykepengegrunnlag() {
    const { personId } = usePersonRouteParams()
    const params = useParams() // Brukes kun for saksbehandlingsperiodeId som kan være undefined
    const router = useRouter()
    const { aktivSaksbehandlingsperiode } = useAktivSaksbehandlingsperiodeMedLoading()

    const sykepengegrunnlag = useQuery<SykepengegrunnlagResponse | null, ProblemDetailsError>({
        queryKey: queryKeys.sykepengegrunnlag(personId, aktivSaksbehandlingsperiode?.id ?? ''),
        queryFn: async (): Promise<SykepengegrunnlagResponse | null> => {
            if (!personId || !aktivSaksbehandlingsperiode?.id) {
                throw new Error('PersonId og saksbehandlingsperiodeId må være tilstede')
            }

            return await fetchAndParse(
                `/api/bakrommet/v2/${personId}/behandlinger/${aktivSaksbehandlingsperiode?.id}/sykepengegrunnlag`,
                sykepengegrunnlagResponseSchema.nullable(),
            )
        },
        enabled: !!personId && !!aktivSaksbehandlingsperiode?.id,
        staleTime: 5 * 60 * 1000, // 5 minutter
    })

    const harOpprettetForBehandlingFraSykepengegrunnlag = sykepengegrunnlag.data?.opprettetForBehandling
    const saksbehandlingsperiodeIdFraUrl = params.saksbehandlingsperiodeId as string | undefined
    const saksbehandlingsperiodeIdForYrkesaktivitet =
        harOpprettetForBehandlingFraSykepengegrunnlag ?? saksbehandlingsperiodeIdFraUrl

    const harSaksbehandlingsperiodeId = !!saksbehandlingsperiodeIdForYrkesaktivitet
    const sykepengegrunnlagErFerdigLastet = !sykepengegrunnlag.isLoading
    const sykepengegrunnlagHarData = sykepengegrunnlag.isSuccess
        ? sykepengegrunnlag.data?.sykepengegrunnlag !== null
        : true

    const yrkesaktivitetFetchEnabled =
        !!personId && harSaksbehandlingsperiodeId && sykepengegrunnlagErFerdigLastet && sykepengegrunnlagHarData

    const query = useQuery<Yrkesaktivitet[], ProblemDetailsError>({
        queryKey: queryKeys.yrkesaktivitet(personId, saksbehandlingsperiodeIdForYrkesaktivitet ?? ''),
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${personId}/behandlinger/${saksbehandlingsperiodeIdForYrkesaktivitet}/yrkesaktivitet`,
                z.array(yrkesaktivitetSchema),
            ),
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
