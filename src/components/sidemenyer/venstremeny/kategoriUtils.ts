import type { Inntektsforhold } from '@/schemas/inntektsforhold'
import { inntektsforholdKodeverk } from '@components/saksbilde/inntektsforhold/inntektsforholdKodeverk'

// Sorteringsrekkefølge for inntektskategorier
export const KATEGORI_SORTERING = [
    'ARBEIDSTAKER',
    'SELVSTENDIG_NÆRINGSDRIVENDE',
    'FRILANSER',
    'ARBEIDSLEDIG',
    'INAKTIV',
    'ANNET',
] as const

export type KategoriKode = (typeof KATEGORI_SORTERING)[number]

export function getKategorierFraInntektsforhold(inntektsforhold: Inntektsforhold[]): Set<string> {
    return new Set(
        inntektsforhold
            .map((forhold) => forhold.kategorisering['INNTEKTSKATEGORI'])
            .filter((kat): kat is string => Boolean(kat)),
    )
}

export function getKategoriNavn(kode: string): string {
    const alternativ = inntektsforholdKodeverk.alternativer.find((alt) => alt.kode === kode)
    return alternativ?.navn || kode
}

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function kategoriSetTilTekstOgWarning(kategorier: Set<string>): { tekst: string | null; warning: boolean } {
    if (kategorier.size === 0) return { tekst: 'Kategori ikke satt', warning: true }

    // Spesialhåndtering for INAKTIV
    if (kategorier.has('INAKTIV')) return { tekst: 'Inaktiv', warning: false }

    // Spesialhåndtering for ANNET
    if (kategorier.has('ANNET')) return { tekst: 'Kategori ikke satt', warning: true }

    // Sorter kategoriene etter definert rekkefølge
    const sorterteKategorier = Array.from(kategorier)
        .filter((kat) => KATEGORI_SORTERING.includes(kat as KategoriKode))
        .sort((a, b) => KATEGORI_SORTERING.indexOf(a as KategoriKode) - KATEGORI_SORTERING.indexOf(b as KategoriKode))

    if (sorterteKategorier.length === 0) return { tekst: 'Kategori ikke satt', warning: true }

    // Hent navn fra kodeverket
    const kategoriNavn = sorterteKategorier.map(getKategoriNavn)

    // Bygg setning programmatisk og kapitaliser
    const tekst = capitalizeFirstLetter(
        (kategoriNavn.length === 1
            ? kategoriNavn[0]
            : kategoriNavn.length === 2
              ? `${kategoriNavn[0]} og ${kategoriNavn[1]}`
              : `${kategoriNavn.slice(0, -1).join(', ')} og ${kategoriNavn[kategoriNavn.length - 1]}`
        ).toLowerCase(),
    )

    return { tekst, warning: false }
}
