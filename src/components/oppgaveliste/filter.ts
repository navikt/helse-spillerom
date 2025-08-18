import { Saksbehandlingsperiode } from '@schemas/saksbehandlingsperiode'

export enum FilterStatus {
    PLUS = 'PLUS',
    MINUS = 'MINUS',
    OFF = 'OFF',
}

export type Filter = {
    key: string
    label: string
    status: FilterStatus
}

export const filterList: Filter[] = [
    {
        key: 'UNDER_BEHANDLING',
        label: 'Under behandling',
        status: FilterStatus.OFF,
    },
    {
        key: 'BESLUTTER',
        label: 'Beslutter',
        status: FilterStatus.OFF,
    },
]

const predicates: Record<Filter['key'], (p: Saksbehandlingsperiode) => boolean> = {
    UNDER_BEHANDLING: (p) => p.status === 'UNDER_BEHANDLING',
    BESLUTTER: (p) => p.status === 'TIL_BESLUTNING' || p.status === 'UNDER_BESLUTNING',
}

export function filtrer(perioder: Saksbehandlingsperiode[], filters: Filter[]): Saksbehandlingsperiode[] {
    return filters.reduce((acc, f) => {
        if (f.status === FilterStatus.OFF) return acc
        const pred = predicates[f.key]
        if (!pred) return acc
        return acc.filter((p) => (f.status === FilterStatus.PLUS ? pred(p) : !pred(p)))
    }, perioder)
}
