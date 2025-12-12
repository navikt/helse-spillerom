import { BriefcaseIcon, PencilLineIcon, SackKronerIcon } from '@navikt/aksel-icons'

import { BehandlingStatus } from '@schemas/behandling'
import { TidslinjeBehandling, TidslinjeYrkesaktivitet } from '@schemas/tidslinje'

type TidslinjeElement = {
    fom: string
    tom: string
    skjæringstidspunkt?: string
    behandlingId: string
    status: BehandlingStatus | 'GHOST'
    generasjonIndex: number
}

type TilkommenTidslinjeElement = {
    fom: string
    tom: string
    behandlingId: string
    tilkommenInntektId: string
}

function toTidslinjeElement(
    behandling: TidslinjeBehandling,
    ya?: TidslinjeYrkesaktivitet,
    generasjonIndex: number = 0,
): TidslinjeElement {
    return {
        fom: behandling.fom,
        tom: behandling.tom,
        skjæringstidspunkt: behandling.skjæringstidspunkt ?? undefined,
        behandlingId: behandling.id,
        status: ya && !ya.sykmeldt ? 'GHOST' : behandling.status,
        generasjonIndex,
    }
}

function getYrkesaktivitetNavn(ya: TidslinjeYrkesaktivitet): string {
    if (ya.yrkesaktivitetType === 'INAKTIV') return 'Inaktiv'
    return ya.orgnavn ?? 'Ukjent virksomhet'
}

export function groupTidslinjeData(behandlinger: TidslinjeBehandling[]) {
    const behandlingMap = new Map(behandlinger.map((b) => [b.id, b]))
    const revurdertIds = new Set(
        behandlinger.map((b) => b.revurdererBehandlingId).filter((id): id is string => id != null),
    )

    const getGenerasjoner = (behandling: TidslinjeBehandling): TidslinjeBehandling[] => {
        const generasjoner: TidslinjeBehandling[] = []
        let currentId = behandling.revurdererBehandlingId
        while (currentId) {
            const prev = behandlingMap.get(currentId)
            if (!prev) break
            generasjoner.push(prev)
            currentId = prev.revurdererBehandlingId
        }
        return generasjoner
    }

    const aktiveBehandlinger = behandlinger.filter((b) => !revurdertIds.has(b.id))

    const tomme: TidslinjeElement[] = []
    const yrkesaktiviteterGrouped: Record<string, { navn: string; tidslinjeElementer: TidslinjeElement[] }> = {}
    const tilkomneGrouped: Record<string, { navn: string; tidslinjeElementer: TilkommenTidslinjeElement[] }> = {}

    for (const behandling of aktiveBehandlinger) {
        const generasjoner = getGenerasjoner(behandling)

        if (behandling.yrkesaktiviteter.length === 0 && behandling.tilkommenInntekt.length === 0) {
            tomme.push(toTidslinjeElement(behandling))
        }

        for (const ya of behandling.yrkesaktiviteter) {
            const key = `${ya.orgnummer}-${ya.yrkesaktivitetType}`
            yrkesaktiviteterGrouped[key] ??= { navn: getYrkesaktivitetNavn(ya), tidslinjeElementer: [] }

            // Push active element (index 0)
            yrkesaktiviteterGrouped[key].tidslinjeElementer.push(toTidslinjeElement(behandling, ya, 0))

            // Push generasjoner with their index
            generasjoner.forEach((gen, index) => {
                const matchingYa = gen.yrkesaktiviteter.find(
                    (genYa) => `${genYa.orgnummer}-${genYa.yrkesaktivitetType}` === key,
                )
                yrkesaktiviteterGrouped[key].tidslinjeElementer.push(toTidslinjeElement(gen, matchingYa, index + 1))
            })
        }

        for (const ti of behandling.tilkommenInntekt) {
            const key = `${ti.orgnavn}-${ti.yrkesaktivitetType}`
            tilkomneGrouped[key] ??= { navn: ti.orgnavn ?? 'Ukjent virksomhet', tidslinjeElementer: [] }
            tilkomneGrouped[key].tidslinjeElementer.push({
                fom: ti.fom,
                tom: ti.tom,
                behandlingId: behandling.id,
                tilkommenInntektId: ti.id,
            })
        }
    }

    return {
        behandlinger: [
            ...(tomme.length > 0
                ? [
                      {
                          id: 'tomme-behandlinger',
                          navn: 'Opprettet behandling',
                          icon: <PencilLineIcon aria-hidden className="text-ax-text-neutral" fontSize="1.5rem" />,
                          tidslinjeElementer: tomme,
                      },
                  ]
                : []),
            ...Object.entries(yrkesaktiviteterGrouped)
                .sort(([, a], [, b]) => a.navn.localeCompare(b.navn, 'nb'))
                .map(([key, value]) => ({
                    id: key,
                    icon: <BriefcaseIcon aria-hidden className="text-ax-text-neutral" fontSize="1.5rem" />,
                    ...value,
                })),
        ],
        tilkomneInntekter: Object.entries(tilkomneGrouped)
            .sort(([, a], [, b]) => a.navn.localeCompare(b.navn, 'nb'))
            .map(([key, value]) => ({
                id: key,
                icon: <SackKronerIcon aria-hidden className="text-ax-text-neutral" fontSize="1.5rem" />,
                ...value,
            })),
    }
}
