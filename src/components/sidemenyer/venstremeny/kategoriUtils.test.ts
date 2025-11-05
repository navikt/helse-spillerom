import { describe, expect, it } from 'vitest'

import type { Yrkesaktivitet } from '@schemas/yrkesaktivitet'

import {
    capitalizeFirstLetter,
    getKategorierFraInntektsforhold,
    getKategoriNavn,
    KATEGORI_SORTERING,
    kategoriSetTilTekstOgWarning,
} from './kategoriUtils'

describe('kategoriUtils', () => {
    describe('getKategorierFraInntektsforhold', () => {
        it('returnerer tomt sett for tom liste', () => {
            const resultat = getKategorierFraInntektsforhold([])
            expect(resultat).toEqual(new Set())
        })

        it('henter ut unike kategorier fra yrkesaktivitet', () => {
            const mockInntektsforhold: Yrkesaktivitet[] = [
                {
                    id: '1',
                    kategorisering: {
                        inntektskategori: 'ARBEIDSTAKER',
                        sykmeldt: true,
                        typeArbeidstaker: {
                            type: 'ORDINÆR',
                            orgnummer: '123456789',
                        },
                    },
                    dagoversikt: null,
                    perioder: null,
                    generertFraDokumenter: [],
                },
                {
                    id: '2',
                    kategorisering: {
                        inntektskategori: 'FRILANSER',
                        sykmeldt: true,
                        orgnummer: '987654321',
                        forsikring: 'INGEN_FORSIKRING',
                    },
                    dagoversikt: null,
                    perioder: null,
                    generertFraDokumenter: [],
                },
                {
                    id: '3',
                    kategorisering: {
                        inntektskategori: 'ARBEIDSTAKER',
                        sykmeldt: true,
                        typeArbeidstaker: {
                            type: 'ORDINÆR',
                            orgnummer: '123456789',
                        },
                    },
                    dagoversikt: null,
                    perioder: null,
                    generertFraDokumenter: [],
                },
            ]

            const resultat = getKategorierFraInntektsforhold(mockInntektsforhold)
            expect(resultat).toEqual(new Set(['ARBEIDSTAKER', 'FRILANSER']))
        })

        it('håndterer flere yrkesaktiviteter med ulike kategorier', () => {
            const mockInntektsforhold: Yrkesaktivitet[] = [
                {
                    id: '1',
                    kategorisering: {
                        inntektskategori: 'ARBEIDSTAKER',
                        sykmeldt: true,
                        typeArbeidstaker: {
                            type: 'ORDINÆR',
                            orgnummer: '123456789',
                        },
                    },
                    dagoversikt: null,
                    perioder: null,
                    generertFraDokumenter: [],
                },
                {
                    id: '2',
                    kategorisering: {
                        inntektskategori: 'SELVSTENDIG_NÆRINGSDRIVENDE',
                        sykmeldt: true,
                        typeSelvstendigNæringsdrivende: {
                            type: 'ORDINÆR',
                            forsikring: 'INGEN_FORSIKRING',
                        },
                    },
                    dagoversikt: null,
                    perioder: null,
                    generertFraDokumenter: [],
                },
                {
                    id: '3',
                    kategorisering: {
                        inntektskategori: 'ARBEIDSLEDIG',
                        sykmeldt: true,
                    },
                    dagoversikt: null,
                    perioder: null,
                    generertFraDokumenter: [],
                },
            ]

            const resultat = getKategorierFraInntektsforhold(mockInntektsforhold)
            expect(resultat).toEqual(new Set(['ARBEIDSTAKER', 'SELVSTENDIG_NÆRINGSDRIVENDE', 'ARBEIDSLEDIG']))
        })
    })

    describe('getKategoriNavn', () => {
        it('returnerer korrekt navn for gyldig kode', () => {
            expect(getKategoriNavn('ARBEIDSTAKER')).toBe('Arbeidstaker')
            expect(getKategoriNavn('FRILANSER')).toBe('Frilanser')
            expect(getKategoriNavn('SELVSTENDIG_NÆRINGSDRIVENDE')).toBe('Selvstendig næringsdrivende')
        })

        it('returnerer kode når navn ikke finnes', () => {
            expect(getKategoriNavn('UKJENT_KODE')).toBe('UKJENT_KODE')
            expect(getKategoriNavn('')).toBe('')
        })
    })

    describe('capitalizeFirstLetter', () => {
        it('gjør første bokstav stor og resten små', () => {
            expect(capitalizeFirstLetter('hello')).toBe('Hello')
            expect(capitalizeFirstLetter('WORLD')).toBe('World')
            expect(capitalizeFirstLetter('tEsT')).toBe('Test')
        })

        it('håndterer tom streng', () => {
            expect(capitalizeFirstLetter('')).toBe('')
        })

        it('håndterer enkelttegn', () => {
            expect(capitalizeFirstLetter('a')).toBe('A')
            expect(capitalizeFirstLetter('Z')).toBe('Z')
        })
    })

    describe('kategoriSetTilTekstOgWarning', () => {
        it('returnerer warning for tomt sett', () => {
            const resultat = kategoriSetTilTekstOgWarning(new Set())
            expect(resultat).toEqual({ tekst: 'Kategori ikke satt', warning: true })
        })

        it('håndterer INAKTIV-kategori', () => {
            const resultat = kategoriSetTilTekstOgWarning(new Set(['INAKTIV']))
            expect(resultat).toEqual({ tekst: 'Inaktiv', warning: false })
        })

        it('håndterer ANNET-kategori med warning', () => {
            const resultat = kategoriSetTilTekstOgWarning(new Set(['ANNET']))
            expect(resultat).toEqual({ tekst: 'Kategori ikke satt', warning: true })
        })

        it('håndterer én gyldig kategori', () => {
            const resultat = kategoriSetTilTekstOgWarning(new Set(['ARBEIDSTAKER']))
            expect(resultat).toEqual({ tekst: 'Arbeidstaker', warning: false })
        })

        it('håndterer to kategorier med "og"', () => {
            const resultat = kategoriSetTilTekstOgWarning(new Set(['ARBEIDSTAKER', 'FRILANSER']))
            expect(resultat).toEqual({ tekst: 'Arbeidstaker og frilanser', warning: false })
        })

        it('håndterer tre eller flere kategorier med komma og "og"', () => {
            const resultat = kategoriSetTilTekstOgWarning(
                new Set(['ARBEIDSTAKER', 'FRILANSER', 'SELVSTENDIG_NÆRINGSDRIVENDE']),
            )
            expect(resultat).toEqual({
                tekst: 'Arbeidstaker, selvstendig næringsdrivende og frilanser',
                warning: false,
            })
        })

        it('sorterer kategorier etter KATEGORI_SORTERING', () => {
            const resultat = kategoriSetTilTekstOgWarning(new Set(['FRILANSER', 'ARBEIDSTAKER']))
            expect(resultat).toEqual({ tekst: 'Arbeidstaker og frilanser', warning: false })
        })

        it('filtrerer ut ukjente kategorier', () => {
            const resultat = kategoriSetTilTekstOgWarning(new Set(['ARBEIDSTAKER', 'UKJENT_KATEGORI']))
            expect(resultat).toEqual({ tekst: 'Arbeidstaker', warning: false })
        })

        it('returnerer warning når kun ukjente kategorier', () => {
            const resultat = kategoriSetTilTekstOgWarning(new Set(['UKJENT_KATEGORI_1', 'UKJENT_KATEGORI_2']))
            expect(resultat).toEqual({ tekst: 'Kategori ikke satt', warning: true })
        })

        it('prioriterer INAKTIV over andre kategorier', () => {
            const resultat = kategoriSetTilTekstOgWarning(new Set(['INAKTIV', 'ARBEIDSTAKER']))
            expect(resultat).toEqual({ tekst: 'Inaktiv', warning: false })
        })

        it('prioriterer ANNET over andre kategorier', () => {
            const resultat = kategoriSetTilTekstOgWarning(new Set(['ANNET', 'ARBEIDSTAKER']))
            expect(resultat).toEqual({ tekst: 'Kategori ikke satt', warning: true })
        })
    })

    describe('KATEGORI_SORTERING', () => {
        it('inneholder alle forventede kategorier i riktig rekkefølge', () => {
            expect(KATEGORI_SORTERING).toEqual([
                'ARBEIDSTAKER',
                'SELVSTENDIG_NÆRINGSDRIVENDE',
                'FRILANSER',
                'ARBEIDSLEDIG',
                'INAKTIV',
                'ANNET',
            ])
        })
    })
})
