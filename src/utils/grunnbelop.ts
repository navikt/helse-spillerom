// Grunnbeløp-logikk som matcher bakrommet sin implementasjon
// Basert på Grunnbelop.kt fra bakrommet

interface HistoriskGrunnbeløp {
    beløp: number // Årlig beløp i kroner
    gyldigFra: string // ISO 8601 date string
    virkningsdato: string // ISO 8601 date string
    gyldigMinsteinntektKrav: string // ISO 8601 date string
}

// Grunnbeløp for alle årene, matcher bakrommet sin liste
const GRUNNBELØP_HISTORIKK: HistoriskGrunnbeløp[] = [
    { beløp: 130160, gyldigFra: '2025-05-01', virkningsdato: '2025-05-01', gyldigMinsteinntektKrav: '2025-06-02' },
    { beløp: 124028, gyldigFra: '2024-05-01', virkningsdato: '2024-05-01', gyldigMinsteinntektKrav: '2024-06-03' },
    { beløp: 118620, gyldigFra: '2023-05-01', virkningsdato: '2023-05-01', gyldigMinsteinntektKrav: '2023-05-29' },
    { beløp: 111477, gyldigFra: '2022-05-01', virkningsdato: '2022-05-01', gyldigMinsteinntektKrav: '2022-05-23' },
    { beløp: 106399, gyldigFra: '2021-05-01', virkningsdato: '2021-05-01', gyldigMinsteinntektKrav: '2021-05-24' },
    { beløp: 101351, gyldigFra: '2020-05-01', virkningsdato: '2020-09-21', gyldigMinsteinntektKrav: '2020-09-21' },
    { beløp: 99858, gyldigFra: '2019-05-01', virkningsdato: '2019-05-01', gyldigMinsteinntektKrav: '2019-05-27' },
    { beløp: 96883, gyldigFra: '2018-05-01', virkningsdato: '2018-05-01', gyldigMinsteinntektKrav: '2018-05-01' },
    { beløp: 93634, gyldigFra: '2017-05-01', virkningsdato: '2017-05-01', gyldigMinsteinntektKrav: '2017-05-01' },
    { beløp: 92576, gyldigFra: '2016-05-01', virkningsdato: '2016-05-01', gyldigMinsteinntektKrav: '2016-05-01' },
    { beløp: 90068, gyldigFra: '2015-05-01', virkningsdato: '2015-05-01', gyldigMinsteinntektKrav: '2015-05-01' },
    { beløp: 88370, gyldigFra: '2014-05-01', virkningsdato: '2014-05-01', gyldigMinsteinntektKrav: '2014-05-01' },
    { beløp: 85245, gyldigFra: '2013-05-01', virkningsdato: '2013-05-01', gyldigMinsteinntektKrav: '2013-05-01' },
    { beløp: 82122, gyldigFra: '2012-05-01', virkningsdato: '2012-05-01', gyldigMinsteinntektKrav: '2012-05-01' },
    { beløp: 79216, gyldigFra: '2011-05-01', virkningsdato: '2011-05-01', gyldigMinsteinntektKrav: '2011-05-01' },
    { beløp: 75641, gyldigFra: '2010-05-01', virkningsdato: '2010-05-01', gyldigMinsteinntektKrav: '2010-05-01' },
    { beløp: 72881, gyldigFra: '2009-05-01', virkningsdato: '2009-05-01', gyldigMinsteinntektKrav: '2009-05-01' },
    { beløp: 70256, gyldigFra: '2008-05-01', virkningsdato: '2008-05-01', gyldigMinsteinntektKrav: '2008-05-01' },
    { beløp: 66812, gyldigFra: '2007-05-01', virkningsdato: '2007-05-01', gyldigMinsteinntektKrav: '2007-05-01' },
    { beløp: 62892, gyldigFra: '2006-05-01', virkningsdato: '2006-05-01', gyldigMinsteinntektKrav: '2006-05-01' },
    { beløp: 60699, gyldigFra: '2005-05-01', virkningsdato: '2005-05-01', gyldigMinsteinntektKrav: '2005-05-01' },
    { beløp: 58778, gyldigFra: '2004-05-01', virkningsdato: '2004-05-01', gyldigMinsteinntektKrav: '2004-05-01' },
    { beløp: 56861, gyldigFra: '2003-05-01', virkningsdato: '2003-05-01', gyldigMinsteinntektKrav: '2003-05-01' },
    { beløp: 54170, gyldigFra: '2002-05-01', virkningsdato: '2002-05-01', gyldigMinsteinntektKrav: '2002-05-01' },
    { beløp: 51360, gyldigFra: '2001-05-01', virkningsdato: '2001-05-01', gyldigMinsteinntektKrav: '2001-05-01' },
    { beløp: 49090, gyldigFra: '2000-05-01', virkningsdato: '2000-05-01', gyldigMinsteinntektKrav: '2000-05-01' },
    { beløp: 46950, gyldigFra: '1999-05-01', virkningsdato: '1999-05-01', gyldigMinsteinntektKrav: '1999-05-01' },
    { beløp: 45370, gyldigFra: '1998-05-01', virkningsdato: '1998-05-01', gyldigMinsteinntektKrav: '1998-05-01' },
    { beløp: 42500, gyldigFra: '1997-05-01', virkningsdato: '1997-05-01', gyldigMinsteinntektKrav: '1997-05-01' },
    { beløp: 41000, gyldigFra: '1996-05-01', virkningsdato: '1996-05-01', gyldigMinsteinntektKrav: '1996-05-01' },
    { beløp: 39230, gyldigFra: '1995-05-01', virkningsdato: '1995-05-01', gyldigMinsteinntektKrav: '1995-05-01' },
    { beløp: 38080, gyldigFra: '1994-05-01', virkningsdato: '1994-05-01', gyldigMinsteinntektKrav: '1994-05-01' },
    { beløp: 37300, gyldigFra: '1993-05-01', virkningsdato: '1993-05-01', gyldigMinsteinntektKrav: '1993-05-01' },
    { beløp: 36500, gyldigFra: '1992-05-01', virkningsdato: '1992-05-01', gyldigMinsteinntektKrav: '1992-05-01' },
    { beløp: 35500, gyldigFra: '1991-05-01', virkningsdato: '1991-05-01', gyldigMinsteinntektKrav: '1991-05-01' },
    { beløp: 34100, gyldigFra: '1990-12-01', virkningsdato: '1990-12-01', gyldigMinsteinntektKrav: '1990-12-01' },
    { beløp: 34000, gyldigFra: '1990-05-01', virkningsdato: '1990-05-01', gyldigMinsteinntektKrav: '1990-05-01' },
    { beløp: 32700, gyldigFra: '1989-04-01', virkningsdato: '1989-04-01', gyldigMinsteinntektKrav: '1989-04-01' },
    { beløp: 31000, gyldigFra: '1988-04-01', virkningsdato: '1988-04-01', gyldigMinsteinntektKrav: '1988-04-01' },
    { beløp: 30400, gyldigFra: '1988-01-01', virkningsdato: '1988-01-01', gyldigMinsteinntektKrav: '1988-01-01' },
    { beløp: 29900, gyldigFra: '1987-05-01', virkningsdato: '1987-05-01', gyldigMinsteinntektKrav: '1987-05-01' },
    { beløp: 28000, gyldigFra: '1986-05-01', virkningsdato: '1986-05-01', gyldigMinsteinntektKrav: '1986-05-01' },
    { beløp: 26300, gyldigFra: '1986-01-01', virkningsdato: '1986-01-01', gyldigMinsteinntektKrav: '1986-01-01' },
    { beløp: 25900, gyldigFra: '1985-05-01', virkningsdato: '1985-05-01', gyldigMinsteinntektKrav: '1985-05-01' },
    { beløp: 24200, gyldigFra: '1984-05-01', virkningsdato: '1984-05-01', gyldigMinsteinntektKrav: '1984-05-01' },
    { beløp: 22600, gyldigFra: '1983-05-01', virkningsdato: '1983-05-01', gyldigMinsteinntektKrav: '1983-05-01' },
    { beløp: 21800, gyldigFra: '1983-01-01', virkningsdato: '1983-01-01', gyldigMinsteinntektKrav: '1983-01-01' },
    { beløp: 21200, gyldigFra: '1982-05-01', virkningsdato: '1982-05-01', gyldigMinsteinntektKrav: '1982-05-01' },
    { beløp: 19600, gyldigFra: '1981-10-01', virkningsdato: '1981-10-01', gyldigMinsteinntektKrav: '1981-10-01' },
    { beløp: 19100, gyldigFra: '1981-05-01', virkningsdato: '1981-05-01', gyldigMinsteinntektKrav: '1981-05-01' },
    { beløp: 17400, gyldigFra: '1981-01-01', virkningsdato: '1981-01-01', gyldigMinsteinntektKrav: '1981-01-01' },
    { beløp: 16900, gyldigFra: '1980-05-01', virkningsdato: '1980-05-01', gyldigMinsteinntektKrav: '1980-05-01' },
    { beløp: 16100, gyldigFra: '1980-01-01', virkningsdato: '1980-01-01', gyldigMinsteinntektKrav: '1980-01-01' },
    { beløp: 15200, gyldigFra: '1979-01-01', virkningsdato: '1979-01-01', gyldigMinsteinntektKrav: '1979-01-01' },
    { beløp: 14700, gyldigFra: '1978-07-01', virkningsdato: '1978-07-01', gyldigMinsteinntektKrav: '1978-07-01' },
    { beløp: 14400, gyldigFra: '1977-12-01', virkningsdato: '1977-12-01', gyldigMinsteinntektKrav: '1977-12-01' },
    { beløp: 13400, gyldigFra: '1977-05-01', virkningsdato: '1977-05-01', gyldigMinsteinntektKrav: '1977-05-01' },
    { beløp: 13100, gyldigFra: '1977-01-01', virkningsdato: '1977-01-01', gyldigMinsteinntektKrav: '1977-01-01' },
    { beløp: 12100, gyldigFra: '1976-05-01', virkningsdato: '1976-05-01', gyldigMinsteinntektKrav: '1976-05-01' },
    { beløp: 11800, gyldigFra: '1976-01-01', virkningsdato: '1976-01-01', gyldigMinsteinntektKrav: '1976-01-01' },
    { beløp: 11000, gyldigFra: '1975-05-01', virkningsdato: '1975-05-01', gyldigMinsteinntektKrav: '1975-05-01' },
    { beløp: 10400, gyldigFra: '1975-01-01', virkningsdato: '1975-01-01', gyldigMinsteinntektKrav: '1975-01-01' },
    { beløp: 9700, gyldigFra: '1974-05-01', virkningsdato: '1974-05-01', gyldigMinsteinntektKrav: '1974-05-01' },
    { beløp: 9200, gyldigFra: '1974-01-01', virkningsdato: '1974-01-01', gyldigMinsteinntektKrav: '1974-01-01' },
    { beløp: 8500, gyldigFra: '1973-01-01', virkningsdato: '1973-01-01', gyldigMinsteinntektKrav: '1973-01-01' },
    { beløp: 7900, gyldigFra: '1972-01-01', virkningsdato: '1972-01-01', gyldigMinsteinntektKrav: '1972-01-01' },
    { beløp: 7500, gyldigFra: '1971-05-01', virkningsdato: '1971-05-01', gyldigMinsteinntektKrav: '1971-05-01' },
    { beløp: 7200, gyldigFra: '1971-01-01', virkningsdato: '1971-01-01', gyldigMinsteinntektKrav: '1971-01-01' },
    { beløp: 6800, gyldigFra: '1970-01-01', virkningsdato: '1970-01-01', gyldigMinsteinntektKrav: '1970-01-01' },
    { beløp: 6400, gyldigFra: '1969-01-01', virkningsdato: '1969-01-01', gyldigMinsteinntektKrav: '1969-01-01' },
    { beløp: 5900, gyldigFra: '1968-01-01', virkningsdato: '1968-01-01', gyldigMinsteinntektKrav: '1968-01-01' },
    { beløp: 5400, gyldigFra: '1967-01-01', virkningsdato: '1967-01-01', gyldigMinsteinntektKrav: '1967-01-01' },
]

// Sortert etter virkningsdato (nyeste først)
const SORTERT_GRUNNBELØP = [...GRUNNBELØP_HISTORIKK].sort(
    (a, b) => new Date(b.virkningsdato).getTime() - new Date(a.virkningsdato).getTime(),
)

/**
 * Finner gjeldende grunnbeløp basert på dato og virkningstidspunkt
 * Matcher bakrommet sin gjeldendeGrunnbeløp-logikk
 */
function finnGjeldendeGrunnbeløp(dato: string, virkningFra: string): HistoriskGrunnbeløp {
    const virkningsdato = new Date(Math.max(new Date(dato).getTime(), new Date(virkningFra).getTime()))
    const datoDate = new Date(dato)

    const gyldigeGrunnbeløp = SORTERT_GRUNNBELØP.filter((grunnbeløp) => {
        const virkningsdatoGrunnbeløp = new Date(grunnbeløp.virkningsdato)
        const gyldigFra = new Date(grunnbeløp.gyldigFra)
        // Matcher bakrommet: virkningsdato >= it.virkningsdato && dato >= it.gyldigFra
        return virkningsdato >= virkningsdatoGrunnbeløp && datoDate >= gyldigFra
    })

    if (gyldigeGrunnbeløp.length === 0) {
        throw new Error(`Finner ingen grunnbeløp etter ${dato}`)
    }

    // Returner det nyeste (første i sortert liste) - matcher bakrommet sin maxByOrNull { it.virkningsdato }
    return gyldigeGrunnbeløp[0]
}

/**
 * Finner virkningstidspunkt for et gitt beløp
 * Matcher bakrommet sin virkningstidspunktFor-logikk
 */
export function finnVirkningstidspunktFor(beløp: number): string {
    const grunnbeløp = SORTERT_GRUNNBELØP.find((gb) => gb.beløp === beløp)
    if (!grunnbeløp) {
        throw new Error(`${beløp} er ikke et Grunnbeløp`)
    }
    return grunnbeløp.virkningsdato
}

/**
 * Beregner grunnbeløp for en gitt dato og multiplikator
 * Matcher bakrommet sin Grunnbeløp.beløp-logikk
 */
export function beregnGrunnbeløp(dato: string, multiplikator: number = 1.0): number {
    const gjeldende = finnGjeldendeGrunnbeløp(dato, dato)
    return gjeldende.beløp * multiplikator
}

/**
 * Beregner 6G for en gitt dato
 * Matcher bakrommet sin Grunnbeløp.6G.beløp-logikk
 */
export function beregn6G(dato: string): number {
    return beregnGrunnbeløp(dato, 6.0)
}

/**
 * Beregner 6G i øre for en gitt dato
 */
export function beregn6GØre(dato: string): number {
    return Math.round(beregn6G(dato) * 100)
}

/**
 * Finner virkningstidspunkt for grunnbeløpet som ble brukt for en gitt dato
 * Matcher bakrommet sin logikk for å finne grunnbeløpVirkningstidspunkt
 */
export function finnGrunnbeløpVirkningstidspunkt(dato: string): string {
    const seksG = beregn6G(dato)
    const grunnbeløpsBeløp = seksG / 6.0 // Konverterer 6G til 1G
    return finnVirkningstidspunktFor(grunnbeløpsBeløp)
}
