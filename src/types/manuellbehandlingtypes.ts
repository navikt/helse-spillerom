export interface Behandling {
    id: string
    fom: string
    tom: string
    aktorid: string
    skjaring: string
    sakstype?: string
    soknadIder: string[]
}

export interface Inntekt extends NyInntekt {
    id: string
    behandlingId: string
}

export interface Vilkarsvurdering {
    id: string
    regelId: string
    behandlingId: string
    vurdering: string | undefined
}

export interface NyVilkarsvurdering {
    regelId: string
}

export interface NyInntekt {
    sykmeldt: boolean
    inntektstype: string | null
    orgnummer?: string
    orgnavn?: string
}

export interface Dag {
    id: string
    inntektId: string
    dagtype: string
    dato: string
}
