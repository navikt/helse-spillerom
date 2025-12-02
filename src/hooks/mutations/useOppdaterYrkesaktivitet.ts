import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putNoContent } from '@utils/fetch'
import { Dagoversikt } from '@/schemas/dagoversikt'
import { Perioder } from '@/schemas/yrkesaktivitet'
import { YrkesaktivitetKategorisering, yrkesaktivitetKategoriseringSchema } from '@schemas/yrkesaktivitetKategorisering'

type KategoriseringMutationProps = {
    yrkesaktivitetId: string
    kategorisering: YrkesaktivitetKategorisering
}

type OppdaterDagerMutationProps = {
    yrkesaktivitetId: string
    dager: Dagoversikt // Kun dagene som skal oppdateres
    notat: string
}

type OppdaterPerioderMutationProps = {
    yrkesaktivitetId: string
    perioder: Perioder | null
}

export function useOppdaterYrkesaktivitetKategorisering() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, KategoriseringMutationProps>({
        mutationFn: async ({ yrkesaktivitetId, kategorisering }) => {
            // Valider kategorisering mot schema før sending
            const validertKategorisering = yrkesaktivitetKategoriseringSchema.parse(kategorisering)
            return await putNoContent(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/kategorisering`,
                validertKategorisering,
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'yrkesaktivitet', params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlag', params.personId, params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'utbetalingsberegning', params.saksbehandlingsperiodeId],
            })
            // Invalider historikk siden kategorisering endring kan legge til ny historikkinnslag
            queryClient.invalidateQueries({
                queryKey: ['saksbehandlingsperiode-historikk', params.personId, params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: ['tidslinje', params.personId],
            })
        },
    })
}

export function useOppdaterYrkesaktivitetDagoversikt() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, OppdaterDagerMutationProps>({
        mutationFn: async ({ yrkesaktivitetId, dager, notat }) => {
            // Send kun dagene som skal oppdateres
            return await putNoContent(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/dagoversikt`,
                { dager, notat },
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'yrkesaktivitet', params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlag', params.personId, params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'utbetalingsberegning', params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: ['tidslinje', params.personId],
            })
        },
    })
}

export function useOppdaterYrkesaktivitetPerioder() {
    const params = useParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, OppdaterPerioderMutationProps>({
        mutationFn: async ({ yrkesaktivitetId, perioder }) => {
            return await putNoContent(
                `/api/bakrommet/v1/${params.personId}/behandlinger/${params.saksbehandlingsperiodeId}/yrkesaktivitet/${yrkesaktivitetId}/perioder`,
                perioder,
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'yrkesaktivitet', params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: ['sykepengegrunnlag', params.personId, params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: [params.personId, 'utbetalingsberegning', params.saksbehandlingsperiodeId],
            })
            queryClient.invalidateQueries({
                queryKey: ['tidslinje', params.personId],
            })
        },
    })
}
