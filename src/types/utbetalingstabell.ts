import { DateString } from './shared'

export type Utbetalingstabelldagtype =
    | 'Syk'
    | 'Ferie'
    | 'FriskHelg'
    | 'Feriehelg'
    | 'SykHelg'
    | 'SykNav'
    | 'Helg'
    | 'Ukjent'
    | 'Egenmelding'
    | 'Permisjon'
    | 'Arbeid'
    | 'Avslått'
    | 'ArbeidIkkeGjenopptatt'
    | 'Foreldrepenger'
    | 'AAP'
    | 'Dagpenger'
    | 'Svangerskapspenger'
    | 'Pleiepenger'
    | 'Omsorgspenger'
    | 'Opplæringspenger'

export type Utbetalingstabelldag = {
    dato: DateString
    grad?: number
}
