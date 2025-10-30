import { Søknad } from '@/schemas/søknad'
import { fromMap } from '@/utils/yrkesaktivitetKategoriseringMapper'
import { YrkesaktivitetKategorisering } from '@/schemas/yrkesaktivitetKategorisering'

/**
 * Mapper arbeidssituasjon fra søknad til kategorisering som brukes i yrkesaktivitet
 * Matcher bakrommet sin logikk for kategorisering
 */
function mapArbeidssituasjonTilSvar(arbeidssituasjon: string): Record<string, string> {
    switch (arbeidssituasjon) {
        case 'ARBEIDSTAKER':
            return {
                INNTEKTSKATEGORI: 'ARBEIDSTAKER',
                TYPE_ARBEIDSTAKER: 'ORDINÆRT_ARBEIDSFORHOLD',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
            }
        case 'FRILANSER':
            return {
                INNTEKTSKATEGORI: 'FRILANSER',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
                FRILANSER_FORSIKRING: 'INGEN_FORSIKRING',
            }
        case 'SELVSTENDIG_NARINGSDRIVENDE':
            return {
                INNTEKTSKATEGORI: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                TYPE_SELVSTENDIG_NÆRINGSDRIVENDE: 'ORDINÆR_SELVSTENDIG_NÆRINGSDRIVENDE',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
                SELVSTENDIG_NÆRINGSDRIVENDE_FORSIKRING: 'INGEN_FORSIKRING',
            }
        case 'FISKER':
            return {
                INNTEKTSKATEGORI: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                TYPE_SELVSTENDIG_NÆRINGSDRIVENDE: 'FISKER',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
            }
        case 'JORDBRUKER':
            return {
                INNTEKTSKATEGORI: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                TYPE_SELVSTENDIG_NÆRINGSDRIVENDE: 'JORDBRUKER',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
                SELVSTENDIG_NÆRINGSDRIVENDE_FORSIKRING: 'INGEN_FORSIKRING',
            }
        case 'ARBEIDSLEDIG':
            return {
                INNTEKTSKATEGORI: 'ARBEIDSLEDIG',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
            }
        case 'ANNET':
            return {
                INNTEKTSKATEGORI: 'ANNET',
            }
        default:
            return {
                INNTEKTSKATEGORI: 'ANNET',
            }
    }
}

/**
 * Lager kategorisering for en søknad basert på arbeidssituasjon og arbeidsgiver
 * Matcher bakrommet sin kategorisering
 */
export function lagKategorisering(søknad: Søknad): YrkesaktivitetKategorisering {
    const kategoriseringMap = mapArbeidssituasjonTilSvar(søknad.arbeidssituasjon || 'ANNET')

    const orgnummer = søknad.arbeidsgiver?.orgnummer

    if (orgnummer) {
        kategoriseringMap.ORGNUMMER = orgnummer
    }

    // Konverter fra Map til strukturert objekt
    return fromMap(kategoriseringMap)
}
