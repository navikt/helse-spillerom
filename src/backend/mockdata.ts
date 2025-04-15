import { nextleton } from 'nextleton'
import dayjs from 'dayjs'

import { Behandling, Dag, Inntekt, Vilkarsvurdering } from '@typer/manuellbehandlingtypes'

export const behandlingstore = nextleton('behandlinger', () => {
    return {} as Record<string, Behandling>
})

export const inntektstore = nextleton('inntekter', () => {
    return {} as Record<string, Inntekt>
})

export const vilkaarstore = nextleton('vilkaar', () => {
    return {} as Record<string, Vilkarsvurdering>
})

export const dager = nextleton('dag', () => {
    return {} as Record<string, Dag>
})

export function hentBehandling(behandlingid: string) {
    if (!behandlingstore[behandlingid]) {
        return null
    }
    return behandlingstore[behandlingid]
}

export function lagreBehandling(behandling: Behandling): Behandling {
    return (behandlingstore[behandling.id] = behandling)
}

export function hentPaaAktorid(aktorid: string): Behandling[] {
    // loop and filter
    const keys = Object.keys(behandlingstore)

    return keys.map((k) => behandlingstore[k]).filter((f) => f.aktorid == aktorid)
}

export function hentInntektForBehandling(behandlingId: string): Inntekt[] {
    const keys = Object.keys(inntektstore)

    return keys.map((k) => inntektstore[k]).filter((f) => f.behandlingId == behandlingId)
}

export function hentVilkaarForBehandling(behandlingId: string): Vilkarsvurdering[] {
    const keys = Object.keys(vilkaarstore)

    return keys.map((k) => vilkaarstore[k]).filter((f) => f.behandlingId == behandlingId)
}

export function lagreVilkaar(vilkaar: Vilkarsvurdering): Vilkarsvurdering {
    return (vilkaarstore[vilkaar.id] = vilkaar)
}

export function slettVilkaar(vilkaarId: string) {
    delete vilkaarstore[vilkaarId]
}

export function lagreInntekt(inntekt: Inntekt): Inntekt {
    const inntekten = (inntektstore[inntekt.id] = inntekt)
    if (inntekten.sykmeldt) {
        lagDagoversikt(inntekt)
    }
    return inntekten
}

export function hentDagoversikt(inntektId: string) {
    const keys = Object.keys(dager)
    return keys.map((k) => dager[k]).filter((f) => f.inntektId == inntektId)
}

export function lagDagoversikt(inntekt: Inntekt) {
    const behandling = hentBehandling(inntekt.behandlingId)
    if (!behandling) {
        return
    }
    const fom = dayjs(behandling.fom)
    const tom = dayjs(behandling.tom)
    // loop over dager og lagre
    for (let i = 0; i < tom.diff(fom, 'day'); i++) {
        const dato = fom.add(i, 'day').format('YYYY-MM-DD')
        const erHelg = dayjs(dato).day() == 0 || dayjs(dato).day() == 6

        const dag = {
            id: inntekt.id + dato,
            inntektId: inntekt.id,
            dagtype: erHelg ? 'Helg' : 'Syk',
            dato: dato,
        }
        dager[dag.id] = dag
    }
}
