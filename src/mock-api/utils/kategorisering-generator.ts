import { Søknad } from '@/schemas/søknad'

/**
 * Mapper arbeidssituasjon fra søknad til kategorisering som brukes i yrkesaktivitet
 * Matcher bakrommet sin logikk for kategorisering
 */
export function mapArbeidssituasjonTilSvar(arbeidssituasjon: string): Record<string, string> {
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
            }
        case 'SELVSTENDIG_NARINGSDRIVENDE':
            return {
                INNTEKTSKATEGORI: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                TYPE_SELVSTENDIG_NÆRINGSDRIVENDE: 'ORDINÆR_SELVSTENDIG_NÆRINGSDRIVENDE',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
            }
        case 'FISKER':
            return {
                INNTEKTSKATEGORI: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                TYPE_SELVSTENDIG_NÆRINGSDRIVENDE: 'FISKER',
                FISKER_BLAD: 'FISKER_BLAD_B',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
            }
        case 'JORDBRUKER':
            return {
                INNTEKTSKATEGORI: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                TYPE_SELVSTENDIG_NÆRINGSDRIVENDE: 'JORDBRUKER',
                ER_SYKMELDT: 'ER_SYKMELDT_JA',
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
export function lagKategorisering(søknad: Søknad): Record<string, string> {
    const kategorisering = mapArbeidssituasjonTilSvar(søknad.arbeidssituasjon || 'ANNET')

    const orgnummer = søknad.arbeidsgiver?.orgnummer

    if (orgnummer) {
        kategorisering.ORGNUMMER = orgnummer
    }

    return kategorisering
}
