import {
    YrkesaktivitetKategorisering,
    TypeSelvstendigNæringsdrivende,
    SelvstendigForsikring,
} from '@/schemas/yrkesaktivitetKategorisering'

class InputValideringException extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'InputValideringException'
    }
}

/**
 * Konverterer fra Map/Record struktur til strukturert YrkesaktivitetKategorisering objekt
 * Portert fra YrkesaktivitetKategoriseringMapper.kt
 */
export function fromMap(map: Record<string, string | string[]>): YrkesaktivitetKategorisering {
    const inntektskategori = map['INNTEKTSKATEGORI']
    if (!inntektskategori || typeof inntektskategori !== 'string') {
        throw new InputValideringException('INNTEKTSKATEGORI mangler')
    }

    switch (inntektskategori) {
        case 'ARBEIDSTAKER':
            return mapArbeidstaker(map)
        case 'FRILANSER':
            return mapFrilanser(map)
        case 'SELVSTENDIG_NÆRINGSDRIVENDE':
            return mapSelvstendigNæringsdrivende(map)
        case 'INAKTIV':
            return mapInaktiv(map)
        case 'ARBEIDSLEDIG':
            return {
                inntektskategori: 'ARBEIDSLEDIG',
                sykmeldt: true,
            }
        default:
            throw new InputValideringException(`Ugyldig INNTEKTSKATEGORI: ${inntektskategori}`)
    }
}

function mapArbeidstaker(map: Record<string, string | string[]>): YrkesaktivitetKategorisering {
    const orgnummer = map['ORGNUMMER']
    if (!orgnummer || typeof orgnummer !== 'string') {
        throw new InputValideringException('ORGNUMMER mangler for ARBEIDSTAKER')
    }

    const sykmeldt = mapSykmeldt(map, 'ARBEIDSTAKER')

    const typeArbeidstaker = map['TYPE_ARBEIDSTAKER']
    if (!typeArbeidstaker || typeof typeArbeidstaker !== 'string') {
        throw new InputValideringException('TYPE_ARBEIDSTAKER mangler for ARBEIDSTAKER')
    }

    const validTypes = [
        'ORDINÆRT_ARBEIDSFORHOLD',
        'MARITIMT_ARBEIDSFORHOLD',
        'FISKER',
        'VERNEPLIKTIG',
        'DAGMAMMA_BARNETS_HJEM',
    ]
    if (!validTypes.includes(typeArbeidstaker)) {
        throw new InputValideringException(`Ugyldig TYPE_ARBEIDSTAKER: ${typeArbeidstaker}`)
    }

    return {
        inntektskategori: 'ARBEIDSTAKER',
        sykmeldt,
        orgnummer,
        typeArbeidstaker: typeArbeidstaker as
            | 'ORDINÆRT_ARBEIDSFORHOLD'
            | 'MARITIMT_ARBEIDSFORHOLD'
            | 'FISKER'
            | 'VERNEPLIKTIG'
            | 'DAGMAMMA_BARNETS_HJEM',
    }
}

function mapFrilanser(map: Record<string, string | string[]>): YrkesaktivitetKategorisering {
    const orgnummer = map['ORGNUMMER']
    if (!orgnummer || typeof orgnummer !== 'string') {
        throw new InputValideringException('ORGNUMMER mangler for FRILANSER')
    }

    const sykmeldt = mapSykmeldt(map, 'FRILANSER')

    const forsikring = map['FRILANSER_FORSIKRING']
    if (!forsikring || typeof forsikring !== 'string') {
        throw new InputValideringException('FRILANSER_FORSIKRING mangler for FRILANSER')
    }

    const validForsikring = ['FORSIKRING_100_PROSENT_FRA_FØRSTE_SYKEDAG', 'INGEN_FORSIKRING']
    if (!validForsikring.includes(forsikring)) {
        throw new InputValideringException(`Ugyldig FRILANSER_FORSIKRING: ${forsikring}`)
    }

    return {
        inntektskategori: 'FRILANSER',
        sykmeldt,
        orgnummer,
        forsikring: forsikring as 'FORSIKRING_100_PROSENT_FRA_FØRSTE_SYKEDAG' | 'INGEN_FORSIKRING',
    }
}

function mapSelvstendigNæringsdrivende(map: Record<string, string | string[]>): YrkesaktivitetKategorisering {
    const sykmeldt = mapSykmeldt(map, 'SELVSTENDIG_NÆRINGSDRIVENDE')

    const typeString = map['TYPE_SELVSTENDIG_NÆRINGSDRIVENDE']
    if (!typeString || typeof typeString !== 'string') {
        throw new InputValideringException('TYPE_SELVSTENDIG_NÆRINGSDRIVENDE mangler')
    }

    let typeSelvstendigNæringsdrivende: TypeSelvstendigNæringsdrivende

    switch (typeString) {
        case 'ORDINÆR_SELVSTENDIG_NÆRINGSDRIVENDE':
            typeSelvstendigNæringsdrivende = {
                type: 'ORDINÆR',
                forsikring: mapSelvstendigForsikring(map),
            }
            break
        case 'BARNEPASSER_EGET_HJEM':
            typeSelvstendigNæringsdrivende = {
                type: 'BARNEPASSER_EGET_HJEM',
                forsikring: mapSelvstendigForsikring(map),
            }
            break
        case 'FISKER':
            typeSelvstendigNæringsdrivende = {
                type: 'FISKER',
                forsikring: 'FORSIKRING_100_PROSENT_FRA_FØRSTE_SYKEDAG',
            }
            break
        case 'JORDBRUKER':
            typeSelvstendigNæringsdrivende = {
                type: 'JORDBRUKER',
                forsikring: mapSelvstendigForsikring(map),
            }
            break
        case 'REINDRIFT':
            typeSelvstendigNæringsdrivende = {
                type: 'REINDRIFT',
                forsikring: mapSelvstendigForsikring(map),
            }
            break
        default:
            throw new InputValideringException(`Ugyldig TYPE_SELVSTENDIG_NÆRINGSDRIVENDE: ${typeString}`)
    }

    return {
        inntektskategori: 'SELVSTENDIG_NÆRINGSDRIVENDE',
        sykmeldt,
        typeSelvstendigNæringsdrivende,
    }
}

function mapSelvstendigForsikring(map: Record<string, string | string[]>): SelvstendigForsikring {
    const forsikringString = map['SELVSTENDIG_NÆRINGSDRIVENDE_FORSIKRING']
    if (!forsikringString || typeof forsikringString !== 'string') {
        throw new InputValideringException('SELVSTENDIG_NÆRINGSDRIVENDE_FORSIKRING mangler')
    }

    const validForsikring = [
        'FORSIKRING_80_PROSENT_FRA_FØRSTE_SYKEDAG',
        'FORSIKRING_100_PROSENT_FRA_17_SYKEDAG',
        'FORSIKRING_100_PROSENT_FRA_FØRSTE_SYKEDAG',
        'INGEN_FORSIKRING',
    ]
    if (!validForsikring.includes(forsikringString)) {
        throw new InputValideringException(`Ugyldig SELVSTENDIG_NÆRINGSDRIVENDE_FORSIKRING: ${forsikringString}`)
    }

    return forsikringString as SelvstendigForsikring
}

function mapInaktiv(map: Record<string, string | string[]>): YrkesaktivitetKategorisering {
    const variantString = map['VARIANT_AV_INAKTIV']
    if (!variantString || typeof variantString !== 'string') {
        throw new InputValideringException('VARIANT_AV_INAKTIV mangler for INAKTIV')
    }

    const validVarianter = ['INAKTIV_VARIANT_A', 'INAKTIV_VARIANT_B']
    if (!validVarianter.includes(variantString)) {
        throw new InputValideringException(`Ugyldig VARIANT_AV_INAKTIV: ${variantString}`)
    }

    return {
        inntektskategori: 'INAKTIV',
        sykmeldt: true,
        variant: variantString as 'INAKTIV_VARIANT_A' | 'INAKTIV_VARIANT_B',
    }
}

function mapSykmeldt(map: Record<string, string | string[]>, inntektskategori: string): boolean {
    const sykmeldtString = map['ER_SYKMELDT']
    if (!sykmeldtString || typeof sykmeldtString !== 'string') {
        throw new InputValideringException(`ER_SYKMELDT mangler for ${inntektskategori}`)
    }

    switch (sykmeldtString) {
        case 'ER_SYKMELDT_JA':
            return true
        case 'ER_SYKMELDT_NEI':
            return false
        default:
            throw new InputValideringException(`Ugyldig ER_SYKMELDT: ${sykmeldtString}`)
    }
}

/**
 * Konverterer fra strukturert YrkesaktivitetKategorisering objekt til Map/Record struktur
 * Portert fra YrkesaktivitetKategoriseringMapper.kt
 */
export function toMap(kategorisering: YrkesaktivitetKategorisering): Record<string, string> {
    const map: Record<string, string> = {}

    map['INNTEKTSKATEGORI'] = kategorisering.inntektskategori

    // Legg til sykmeldt (ikke for ARBEIDSLEDIG og INAKTIV siden de alltid er sykmeldt)
    if (kategorisering.inntektskategori !== 'ARBEIDSLEDIG' && kategorisering.inntektskategori !== 'INAKTIV') {
        map['ER_SYKMELDT'] = kategorisering.sykmeldt ? 'ER_SYKMELDT_JA' : 'ER_SYKMELDT_NEI'
    } else {
        // For INAKTIV og ARBEIDSLEDIG, sett alltid til JA
        map['ER_SYKMELDT'] = 'ER_SYKMELDT_JA'
    }

    switch (kategorisering.inntektskategori) {
        case 'ARBEIDSTAKER':
            map['ORGNUMMER'] = kategorisering.orgnummer
            map['TYPE_ARBEIDSTAKER'] = kategorisering.typeArbeidstaker
            break
        case 'FRILANSER':
            map['ORGNUMMER'] = kategorisering.orgnummer
            map['FRILANSER_FORSIKRING'] = kategorisering.forsikring
            break
        case 'SELVSTENDIG_NÆRINGSDRIVENDE': {
            const type = kategorisering.typeSelvstendigNæringsdrivende
            map['TYPE_SELVSTENDIG_NÆRINGSDRIVENDE'] = (() => {
                switch (type.type) {
                    case 'ORDINÆR':
                        return 'ORDINÆR_SELVSTENDIG_NÆRINGSDRIVENDE'
                    case 'BARNEPASSER_EGET_HJEM':
                        return 'BARNEPASSER_EGET_HJEM'
                    case 'FISKER':
                        return 'FISKER'
                    case 'JORDBRUKER':
                        return 'JORDBRUKER'
                    case 'REINDRIFT':
                        return 'REINDRIFT'
                }
            })()
            map['SELVSTENDIG_NÆRINGSDRIVENDE_FORSIKRING'] = type.forsikring
            break
        }
        case 'INAKTIV':
            map['VARIANT_AV_INAKTIV'] = kategorisering.variant
            break
        case 'ARBEIDSLEDIG':
            // Ingen ekstra felter
            break
    }

    return map
}
