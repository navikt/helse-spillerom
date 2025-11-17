import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { z } from 'zod/v4'

import { fetchAndParse } from '@utils/fetch'
import { ProblemDetailsError } from '@utils/ProblemDetailsError'
import { Yrkesaktivitet, yrkesaktivitetSchema } from '@schemas/yrkesaktivitet'
import { useAktivSaksbehandlingsperiodeMedLoading } from '@hooks/queries/useAktivSaksbehandlingsperiode'
import { SykepengegrunnlagResponse, sykepengegrunnlagResponseSchema } from '@schemas/sykepengegrunnlag'

export function useYrkesaktivitetForSykepengegrunnlag() {
    const params = useParams()
    const router = useRouter()
    const { aktivSaksbehandlingsperiode } = useAktivSaksbehandlingsperiodeMedLoading()

    const personId = params?.personId as string

    const sykepengegrunnlag = useQuery<SykepengegrunnlagResponse | null, ProblemDetailsError>({
        queryKey: ['sykepengegrunnlag', personId, aktivSaksbehandlingsperiode?.id],
        queryFn: async (): Promise<SykepengegrunnlagResponse | null> => {
            if (!personId || !aktivSaksbehandlingsperiode?.id) {
                throw new Error('PersonId og saksbehandlingsperiodeId må være tilstede')
            }

            return await fetchAndParse(
                `/api/bakrommet/v2/${personId}/saksbehandlingsperioder/${aktivSaksbehandlingsperiode?.id}/sykepengegrunnlag`,
                sykepengegrunnlagResponseSchema.nullable(),
            )
        },
        enabled: !!personId && !!aktivSaksbehandlingsperiode?.id,
        staleTime: 5 * 60 * 1000, // 5 minutter
    })

    const harOpprettetForBehandlingFraSykepengegrunnlag = sykepengegrunnlag.data?.opprettetForBehandling
    const saksbehandlingsperiodeIdFraUrl = params.saksbehandlingsperiodeId as string
    const saksbehandlingsperiodeIdForYrkesaktivitet =
        harOpprettetForBehandlingFraSykepengegrunnlag ?? saksbehandlingsperiodeIdFraUrl

    const harPersonId = !!params.personId
    const harSaksbehandlingsperiodeId = !!saksbehandlingsperiodeIdForYrkesaktivitet
    const sykepengegrunnlagErFerdigLastet = !sykepengegrunnlag.isLoading
    const sykepengegrunnlagHarData = sykepengegrunnlag.isSuccess
        ? sykepengegrunnlag.data?.sykepengegrunnlag !== null
        : true

    const yrkesaktivitetFetchEnabled =
        harPersonId && harSaksbehandlingsperiodeId && sykepengegrunnlagErFerdigLastet && sykepengegrunnlagHarData

    const query = useQuery<Yrkesaktivitet[], ProblemDetailsError>({
        queryKey: [params.personId, 'yrkesaktivitet', saksbehandlingsperiodeIdForYrkesaktivitet],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${saksbehandlingsperiodeIdForYrkesaktivitet}/yrkesaktivitet`,
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
