/**
 * Beregner dekningsgrad basert på yrkesaktivitet-kategorisering
 * Matcher logikken fra bakrommet sin YrkesaktivitetExtensions.hentDekningsgrad()
 */

export function beregnDekningsgrad(kategorisering: Record<string, string | string[]>): number {
    const inntektskategori = kategorisering['INNTEKTSKATEGORI'] as string

    switch (inntektskategori) {
        case 'SELVSTENDIG_NÆRINGSDRIVENDE': {
            const forsikring = kategorisering['SELVSTENDIG_NÆRINGSDRIVENDE_FORSIKRING'] as string

            switch (forsikring) {
                case 'FORSIKRING_100_PROSENT_FRA_FØRSTE_SYKEDAG':
                case 'FORSIKRING_100_PROSENT_FRA_17_SYKEDAG':
                    return 100
                case 'FORSIKRING_80_PROSENT_FRA_FØRSTE_SYKEDAG':
                case 'INGEN_FORSIKRING':
                    return 80
                default:
                    throw new Error(`Ukjent forsikringstype for selvstendig næringsdrivende: ${forsikring}`)
            }
        }

        case 'INAKTIV': {
            const variant = kategorisering['VARIANT_AV_INAKTIV'] as string

            switch (variant) {
                case 'INAKTIV_VARIANT_A':
                    return 65
                case 'INAKTIV_VARIANT_B':
                    return 100
                default:
                    throw new Error(`Ukjent variant for inaktiv: ${variant}`)
            }
        }

        case 'ARBEIDSTAKER':
        case 'FRILANSER':
        case 'ARBEIDSLEDIG':
            return 100

        default:
            throw new Error(`Ukjent inntektskategori: ${inntektskategori}`)
    }
}
