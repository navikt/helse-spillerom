export type DateString = string

export type DatePeriod = {
    fom: string
    tom: string
}

export type InfotrygdPeriod = DatePeriod & {
    grad: string
    dagsats: number
    typetekst: string
}

export type PeriodState =
    | 'tilUtbetaling'
    | 'utbetalt'
    | 'tilGodkjenning'
    | 'venterPåInntektsopplysninger'
    | 'venter'
    | 'venterPåKiling'
    | 'avslag'
    | 'ingenUtbetaling'
    | 'forkastetIngenUtbetaling'
    | 'kunFerie'
    | 'kunPermisjon'
    | 'utbetalingFeilet'
    | 'revurderingFeilet'
    | 'ukjent'
    | 'tilInfotrygd'
    | 'annullert'
    | 'tilAnnullering'
    | 'annulleringFeilet'
    | 'utbetaltAutomatisk'
    | 'tilUtbetalingAutomatisk'
    | 'revurderes'
    | 'revurdert'
    | 'revurdertIngenUtbetaling'
    | 'utenSykefravær'
    | 'utenSykefraværDeaktivert'
    | 'infotrygdUtbetalt'
    | 'infotrygdFerie'
    | 'infotrygdUkjent'
    | 'tilSkjønnsfastsettelse'
    | 'tilkommenInntekt'

export type OverridableConstructor<T, E = object> = (overrides?: Partial<T>) => T & E
