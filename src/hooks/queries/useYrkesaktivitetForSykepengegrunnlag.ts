import {useParams, useRouter} from 'next/navigation'
import {useQuery} from '@tanstack/react-query'
import {useEffect} from 'react'
import {z} from 'zod/v4'

import {fetchAndParse} from '@utils/fetch'
import {ProblemDetailsError} from '@utils/ProblemDetailsError'
import {Yrkesaktivitet, yrkesaktivitetSchema} from '@schemas/yrkesaktivitet'
import {useAktivSaksbehandlingsperiodeMedLoading} from "@hooks/queries/useAktivSaksbehandlingsperiode";
import {SykepengegrunnlagResponse, sykepengegrunnlagResponseSchema} from "@schemas/sykepengegrunnlagV2";

export function useYrkesaktivitetForSykepengegrunnlag() {
    const params = useParams()
    const router = useRouter()
    const {aktivSaksbehandlingsperiode} = useAktivSaksbehandlingsperiodeMedLoading()

    const personId = params?.personId as string

    const sykepengegrunnlag = useQuery<SykepengegrunnlagResponse | null, ProblemDetailsError>({
        queryKey: ['sykepengegrunnlagV2', personId, aktivSaksbehandlingsperiode?.id],
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



    const saksbehandlingsperiodeIdForYrkesaktivitet = sykepengegrunnlag.data?.opprettetForBehandling ?? (params.saksbehandlingsperiodeId as string)

    const query = useQuery<Yrkesaktivitet[], ProblemDetailsError>({
        queryKey: [params.personId, 'yrkesaktivitet', saksbehandlingsperiodeIdForYrkesaktivitet],
        queryFn: () =>
            fetchAndParse(
                `/api/bakrommet/v1/${params.personId}/saksbehandlingsperioder/${saksbehandlingsperiodeIdForYrkesaktivitet}/yrkesaktivitet`,
                z.array(yrkesaktivitetSchema),
            ),
        enabled: !!params.personId && !!saksbehandlingsperiodeIdForYrkesaktivitet && (
            !sykepengegrunnlag.isLoading && (
                sykepengegrunnlag.isSuccess 
                    ? (sykepengegrunnlag.data?.sykepengegrunnlag !== null)
                    : true
            )
        ),
    })

    useEffect(() => {
        if (query.error && query.error.problem?.status === 404) {
            // Naviger til rot-nivået hvis API-et returnerer 404
            router.push('/')
        }
    }, [query.error, router])

    return query
}
