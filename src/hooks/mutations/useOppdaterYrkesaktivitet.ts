import { useParams } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putNoContent } from '@utils/fetch'
import { Dagoversikt } from '@/schemas/dagoversikt'
import { Perioder } from '@/schemas/yrkesaktivitet'
import { YrkesaktivitetKategorisering, yrkesaktivitetKategoriseringSchema } from '@schemas/yrkesaktivitetKategorisering'
import {
    invaliderYrkesaktivitetRelaterteQueries,
    invaliderSaksbehandlingsperiodeHistorikk,
} from '@utils/queryInvalidation'

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
            const personId = params.personId as string
            const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string
            invaliderYrkesaktivitetRelaterteQueries(queryClient, personId, saksbehandlingsperiodeId)
            // Invalider historikk siden kategorisering endring kan legge til ny historikkinnslag
            invaliderSaksbehandlingsperiodeHistorikk(queryClient, personId, saksbehandlingsperiodeId)
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
            const personId = params.personId as string
            const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string
            invaliderYrkesaktivitetRelaterteQueries(queryClient, personId, saksbehandlingsperiodeId)
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
            const personId = params.personId as string
            const saksbehandlingsperiodeId = params.saksbehandlingsperiodeId as string
            invaliderYrkesaktivitetRelaterteQueries(queryClient, personId, saksbehandlingsperiodeId)
        },
    })
}
