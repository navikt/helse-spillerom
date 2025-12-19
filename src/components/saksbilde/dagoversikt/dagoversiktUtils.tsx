import { ReactElement } from 'react'
import { BandageIcon } from '@navikt/aksel-icons'

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

export function formaterTotalGrad(totalGrad: number | undefined | null): string {
    if (totalGrad == null) {
        return '-'
    }
    const prosent = Math.round(totalGrad * 100)
    return `${prosent} %`
}

export function getDagtypeIcon(dagtype: Dagtype, helgedag: boolean): ReactElement {
    const spanMedBredde = <span className="w-[18px]" />

    if (helgedag) {
        return spanMedBredde
    }

    switch (dagtype) {
        case 'Syk':
        case 'SykNav':
        case 'Behandlingsdag':
            return <BandageIcon aria-hidden />
        default:
            return spanMedBredde
    }
}

export function sumArbeidsgiverbeløpForYrkesaktivitet(
    utbetalingsberegning: BeregningResponse | null | undefined,
    yrkesaktivitetId: string,
): number {
    const yrkesaktivitet = utbetalingsberegning?.beregningData?.yrkesaktiviteter?.find(
        (ya) => ya.yrkesaktivitetId === yrkesaktivitetId,
    )
    if (!yrkesaktivitet) return 0

    return yrkesaktivitet.utbetalingstidslinje.dager.reduce((sum, dag) => sum + (dag.økonomi.arbeidsgiverbeløp ?? 0), 0)
}

export function sumPersonbeløpForYrkesaktivitet(
    utbetalingsberegning: BeregningResponse | null | undefined,
    yrkesaktivitetId: string,
): number {
    const yrkesaktivitet = utbetalingsberegning?.beregningData?.yrkesaktiviteter?.find(
        (ya) => ya.yrkesaktivitetId === yrkesaktivitetId,
    )
    if (!yrkesaktivitet) return 0

    return yrkesaktivitet.utbetalingstidslinje.dager.reduce((sum, dag) => sum + (dag.økonomi.personbeløp ?? 0), 0)
}
