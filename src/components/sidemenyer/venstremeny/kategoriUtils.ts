import type { Yrkesaktivitet } from '@schemas/yrkesaktivitet'
import { yrkesaktivitetKodeverk } from '@components/saksbilde/yrkesaktivitet/YrkesaktivitetKodeverk'

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

export function getKategorierFraInntektsforhold(yrkesaktivitet: Yrkesaktivitet[]): Set<string> {
    return new Set(
        yrkesaktivitet
            .map((forhold) => forhold.kategorisering['INNTEKTSKATEGORI'])
            .filter((kat): kat is string => Boolean(kat)),
    )
}

export function getKategoriNavn(kode: string): string {
    const alternativ = yrkesaktivitetKodeverk.alternativer.find((alt) => alt.kode === kode)
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

// type som extender Yrkesaktivitet med dekningsgrad
export type YrkesaktivitetMedDekningsgrad = Yrkesaktivitet & { dekningsgrad: number }

export function beregnDekningsgradTiVenstremeny(
    yrkesaktivitet: YrkesaktivitetMedDekningsgrad[],
): { tekst: string; tall: number } | null {
    if (!yrkesaktivitet || yrkesaktivitet.length === 0) return null

    // Filtrer kun yrkesaktiviteter hvor personen er sykmeldt fra
    const sykmeldteYrkesaktiviteter = yrkesaktivitet.filter(
        (ya) => ya.kategorisering['ER_SYKMELDT'] === 'ER_SYKMELDT_JA',
    )

    if (sykmeldteYrkesaktiviteter.length === 0) return null

    const kategorier = getKategorierFraInntektsforhold(sykmeldteYrkesaktiviteter)

    // Vis bare dekningsgrad for næringsdrivende eller inaktive
    const harNæringsdrivende = kategorier.has('SELVSTENDIG_NÆRINGSDRIVENDE')
    const harInaktiv = kategorier.has('INAKTIV')

    if (!harNæringsdrivende && !harInaktiv) return null

    // Finn yrkesaktivitet med næringsdrivende eller inaktiv kategorisering
    const næringsdrivende = sykmeldteYrkesaktiviteter.find(
        (ya) => ya.kategorisering['INNTEKTSKATEGORI'] === 'SELVSTENDIG_NÆRINGSDRIVENDE',
    )
    const inaktiv = sykmeldteYrkesaktiviteter.find((ya) => ya.kategorisering['INNTEKTSKATEGORI'] === 'INAKTIV')

    // Prioriter næringsdrivende hvis den finnes
    if (næringsdrivende) {
        const tekst = kategorier.size > 1 ? 'Dekningsgrad (næringsdrivende)' : 'Dekningsgrad'
        return { tekst, tall: næringsdrivende.dekningsgrad }
    }

    // Ellers bruk inaktiv hvis den finnes
    if (inaktiv) {
        return { tekst: 'Dekningsgrad', tall: inaktiv.dekningsgrad }
    }

    return null
}
