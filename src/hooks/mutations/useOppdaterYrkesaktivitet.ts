import { useMutation, useQueryClient } from '@tanstack/react-query'

import { putNoContent } from '@utils/fetch'
import { Dagoversikt } from '@/schemas/dagoversikt'
import { Perioder } from '@/schemas/yrkesaktivitet'
import { YrkesaktivitetKategorisering, yrkesaktivitetKategoriseringSchema } from '@schemas/yrkesaktivitetKategorisering'
import {
    invaliderYrkesaktivitetRelaterteQueries,
    invaliderSaksbehandlingsperiodeHistorikk,
} from '@utils/queryInvalidation'
import { useRouteParams } from '@hooks/useRouteParams'

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
    const { pseudoId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, KategoriseringMutationProps>({
        mutationFn: async ({ yrkesaktivitetId, kategorisering }) => {
            // Valider kategorisering mot schema før sending
            const validertKategorisering = yrkesaktivitetKategoriseringSchema.parse(kategorisering)
            return await putNoContent(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/yrkesaktivitet/${yrkesaktivitetId}/kategorisering`,
                validertKategorisering,
            )
        },
        onSuccess: () => {
            invaliderYrkesaktivitetRelaterteQueries(queryClient, pseudoId, behandlingId)
            // Invalider historikk siden kategorisering endring kan legge til ny historikkinnslag
            invaliderSaksbehandlingsperiodeHistorikk(queryClient, pseudoId, behandlingId)
        },
    })
}

export function useOppdaterYrkesaktivitetDagoversikt() {
    const { pseudoId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, OppdaterDagerMutationProps>({
        mutationFn: async ({ yrkesaktivitetId, dager, notat }) => {
            // Send kun dagene som skal oppdateres
            return await putNoContent(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/yrkesaktivitet/${yrkesaktivitetId}/dagoversikt`,
                { dager, notat },
            )
        },
        onSuccess: () => {
            invaliderYrkesaktivitetRelaterteQueries(queryClient, pseudoId, behandlingId)
        },
    })
}

export function useOppdaterYrkesaktivitetPerioder() {
    const { pseudoId, behandlingId } = useRouteParams()
    const queryClient = useQueryClient()

    return useMutation<void, Error, OppdaterPerioderMutationProps>({
        mutationFn: async ({ yrkesaktivitetId, perioder }) => {
            return await putNoContent(
                `/api/bakrommet/v1/${pseudoId}/behandlinger/${behandlingId}/yrkesaktivitet/${yrkesaktivitetId}/perioder`,
                perioder,
            )
        },
        onSuccess: () => {
            invaliderYrkesaktivitetRelaterteQueries(queryClient, pseudoId, behandlingId)
        },
    })
}
