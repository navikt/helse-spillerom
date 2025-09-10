import { type Vilkårshjemmel } from '@schemas/kodeverkV2'

/**
 * Formaterer en vilkårshjemmel til en lesbar paragraf-referanse
 *
 * @param hjemmel - Vilkårshjemmel objektet som skal formateres
 * @returns Formatert paragraf-referanse som tekst
 *
 * @example
 * // Kun kapittel
 * formatParagraf({ kapittel: '2', lovverk: 'folketrygdloven' })
 * // Returns: "Kapittel 2"
 *
 * @example
 * // Kapittel og paragraf
 * formatParagraf({ kapittel: '2', paragraf: '1', lovverk: 'folketrygdloven' })
 * // Returns: "§2-1"
 *
 * @example
 * // Med ledd, setning og bokstav
 * formatParagraf({
 *   kapittel: '2',
 *   paragraf: '1',
 *   ledd: '2',
 *   setning: '1',
 *   bokstav: 'a',
 *   lovverk: 'folketrygdloven'
 * })
 * // Returns: "§2-1 2. ledd 1. setning bokstav a"
 */
export function formatParagraf(hjemmel: Vilkårshjemmel): string {
    const { kapittel, paragraf, ledd, setning, bokstav } = hjemmel
    if (!kapittel) return ''

    // Hvis det bare er kapittel (ingen paragraf), vis som "Kapittel X"
    if (!paragraf) {
        return `Kapittel ${kapittel}`
    }

    // Hvis det er paragraf, vis som "§X-Y" med eventuelle ledd/setning/bokstav
    let result = `§${kapittel}-${paragraf}`
    if (ledd) result += ` ${ledd}. ledd`
    if (setning) result += ` ${setning}. setning`
    if (bokstav) result += ` bokstav ${bokstav}`
    return result
}

/**
 * Genererer Lovdata URL for folketrygdloven
 *
 * @param hjemmel - Vilkårshjemmel objektet
 * @returns URL til Lovdata eller undefined hvis ikke folketrygdloven
 *
 * @example
 * getLovdataUrl({ kapittel: '8', paragraf: '1', lovverk: 'folketrygdloven' })
 * // Returns: "https://lovdata.no/lov/1997-02-28-19/§8-1"
 *
 * @example
 * getLovdataUrl({ kapittel: '2', lovverk: 'folketrygdloven' })
 * // Returns: "https://lovdata.no/lov/1997-02-28-19/§2-1"
 */
export function getLovdataUrl(hjemmel: Vilkårshjemmel): string | undefined {
    const { lovverk, kapittel, paragraf } = hjemmel

    // Kun for folketrygdloven
    if (lovverk?.toLowerCase().includes('folketrygdloven') && kapittel) {
        const paragrafNummer = paragraf || '1' // Bruk paragraf 1 hvis ingen paragraf er spesifisert
        return `https://lovdata.no/lov/1997-02-28-19/§${kapittel}-${paragrafNummer}`
    }

    return undefined
}
