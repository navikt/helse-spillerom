// dagoversiktUtils.ts
import { Dagtype } from '@schemas/dagoversikt'
import { Periode, Periodetype, Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { BeregningResponse } from '@schemas/utbetalingsberegning'

export const andreYtelserTypeText: Record<string, string> = {
    AndreYtelserAap: 'AAP',
    AndreYtelserDagpenger: 'Dagpenger',
    AndreYtelserForeldrepenger: 'Foreldrepenger',
    AndreYtelserOmsorgspenger: 'Omsorgspenger',
    AndreYtelserOpplaringspenger: 'Opplæringspenger',
    AndreYtelserPleiepenger: 'Pleiepenger',
    AndreYtelserSvangerskapspenger: 'Svangerskapspenger',
}

export function finnUtbetalingsdata(utbetalingsberegning: BeregningResponse, yrkesaktivitetId: string, dato: string) {
    const yrkesaktivitetData = utbetalingsberegning?.beregningData?.yrkesaktiviteter?.find(
        (ya) => ya.yrkesaktivitetId === yrkesaktivitetId,
    )
    return yrkesaktivitetData?.utbetalingstidslinje.dager.find((dag) => dag.dato === dato) ?? null
}

export function erDagIPeriode(dato: string, periodeType: Periodetype, yrkesaktivitet: Yrkesaktivitet): boolean {
    if (yrkesaktivitet?.perioder?.type !== periodeType) return false
    return yrkesaktivitet.perioder.perioder.some((periode: Periode) => dato >= periode.fom && dato <= periode.tom)
}

export function getDagtypeText(
    type: Dagtype,
    andreYtelserType?: string[],
    erHelgedag?: boolean,
    erAGP?: boolean,
    erVentetid?: boolean,
): string {
    const baseText =
        type === 'AndreYtelser' && andreYtelserType
            ? andreYtelserTypeText[andreYtelserType[0]]
            : ({
                  Syk: 'Syk',
                  SykNav: 'Syk (NAV)',
                  Behandlingsdag: 'Behandlingsdag',
                  Ferie: 'Ferie',
                  Arbeidsdag: 'Arbeid',
                  Permisjon: 'Permisjon',
                  Avslått: 'Avslått',
                  AndreYtelser: 'Andre ytelser',
              }[type] ?? type)

    if (erHelgedag) return `Helg (${erAGP ? 'AGP' : erVentetid ? 'Ventetid' : baseText})`
    if (erAGP) return `${baseText} (AGP)`
    if (erVentetid) return `${baseText} (Ventetid)`
    return baseText
}
