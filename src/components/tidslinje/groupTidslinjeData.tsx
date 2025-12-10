import { BriefcaseIcon, PencilLineIcon, SackKronerIcon } from '@navikt/aksel-icons'

import { BehandlingStatus } from '@schemas/behandling'
import { TidslinjeBehandling } from '@schemas/tidslinje'

type TidslinjeElement = {
    fom: string
    tom: string
    skjæringstidspunkt?: string
    behandlingId: string
    status: BehandlingStatus
    ghost?: boolean
}

type TilkommenTidslinjeElement = {
    fom: string
    tom: string
    behandlingId: string
    tilkommenInntektId: string
}

export function groupTidslinjeData(behandlinger: TidslinjeBehandling[]) {
    const tomme: TidslinjeElement[] = []
    const yrkesaktiviteterGrouped: Record<string, { navn: string; tidslinjeElementer: TidslinjeElement[] }> = {}
    const tilkomneGrouped: Record<string, { navn: string; tidslinjeElementer: TilkommenTidslinjeElement[] }> = {}

    behandlinger.forEach((behandling) => {
        if (behandling.yrkesaktiviteter.length === 0 && behandling.tilkommenInntekt.length === 0) {
            tomme.push({
                fom: behandling.fom,
                tom: behandling.tom,
                skjæringstidspunkt: behandling.skjæringstidspunkt ?? undefined,
                behandlingId: behandling.id,
                status: behandling.status,
            })
        }

        behandling.yrkesaktiviteter.forEach((ya) => {
            const key = `${ya.orgnummer}-${ya.yrkesaktivitetType}`
            if (!yrkesaktiviteterGrouped[key]) {
                yrkesaktiviteterGrouped[key] = { navn: ya.orgnavn ?? 'Ukjent virksomhet', tidslinjeElementer: [] }
            }
            yrkesaktiviteterGrouped[key].tidslinjeElementer.push({
                fom: behandling.fom,
                tom: behandling.tom,
                skjæringstidspunkt: behandling.skjæringstidspunkt ?? undefined,
                behandlingId: behandling.id,
                status: behandling.status,
                ghost: !ya.sykmeldt,
            })
        })

        behandling.tilkommenInntekt.forEach((ti) => {
            const key = `${ti.orgnavn}-${ti.yrkesaktivitetType}`
            if (!tilkomneGrouped[key]) {
                tilkomneGrouped[key] = { navn: ti.orgnavn ?? 'Ukjent virksomhet', tidslinjeElementer: [] }
            }
            tilkomneGrouped[key].tidslinjeElementer.push({
                fom: ti.fom,
                tom: ti.tom,
                behandlingId: behandling.id,
                tilkommenInntektId: ti.id,
            })
        })
    })

    return {
        behandlinger: [
            ...(tomme.length > 0
                ? [
                      {
                          id: 'tomme-behandlinger',
                          navn: 'Opprettet behandling',
                          icon: <PencilLineIcon aria-hidden fontSize="1.5rem" />,
                          tidslinjeElementer: tomme,
                      },
                  ]
                : []),
            ...Object.entries(yrkesaktiviteterGrouped).map(([key, value]) => ({
                id: key,
                icon: <BriefcaseIcon aria-hidden fontSize="1.5rem" />,
                ...value,
            })),
        ],
        tilkomneInntekter: Object.entries(tilkomneGrouped).map(([key, value]) => ({
            id: key,
            icon: <SackKronerIcon aria-hidden fontSize="1.5rem" />,
            ...value,
        })),
    }
}
