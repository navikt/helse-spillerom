import { describe, it, expect } from 'vitest'

import { type Vilkårshjemmel } from '@schemas/kodeverkV2'

import { formatParagraf, getLovdataUrl } from './paragraf-formatering'

describe('formatParagraf', () => {
    it('skal returnere tom streng hvis ingen kapittel', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'folketrygdloven',
            lovverksversjon: '1997-02-28-19',
            kapittel: '',
            paragraf: '1',
        }

        expect(formatParagraf(hjemmel)).toBe('')
    })

    it('skal returnere "Kapittel X" når det bare er kapittel', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'folketrygdloven',
            lovverksversjon: '1997-02-28-19',
            kapittel: '2',
            paragraf: '',
        }

        expect(formatParagraf(hjemmel)).toBe('Kapittel 2')
    })

    it('skal returnere "§X-Y" når det er kapittel og paragraf', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'folketrygdloven',
            lovverksversjon: '1997-02-28-19',
            kapittel: '8',
            paragraf: '1',
        }

        expect(formatParagraf(hjemmel)).toBe('§8-1')
    })

    it('skal inkludere ledd når det er spesifisert', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'folketrygdloven',
            lovverksversjon: '1997-02-28-19',
            kapittel: '8',
            paragraf: '1',
            ledd: '2',
        }

        expect(formatParagraf(hjemmel)).toBe('§8-1 2. ledd')
    })

    it('skal inkludere setning når det er spesifisert', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'folketrygdloven',
            lovverksversjon: '1997-02-28-19',
            kapittel: '8',
            paragraf: '1',
            ledd: '2',
            setning: '1',
        }

        expect(formatParagraf(hjemmel)).toBe('§8-1 2. ledd 1. setning')
    })

    it('skal inkludere bokstav når det er spesifisert', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'folketrygdloven',
            lovverksversjon: '1997-02-28-19',
            kapittel: '8',
            paragraf: '1',
            ledd: '2',
            setning: '1',
            bokstav: 'a',
        }

        expect(formatParagraf(hjemmel)).toBe('§8-1 2. ledd 1. setning bokstav a')
    })

    it('skal håndtere null/undefined verdier', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'folketrygdloven',
            lovverksversjon: '1997-02-28-19',
            kapittel: '8',
            paragraf: '1',
            ledd: null,
            setning: undefined,
            bokstav: null,
        }

        expect(formatParagraf(hjemmel)).toBe('§8-1')
    })
})

describe('getLovdataUrl', () => {
    it('skal returnere undefined hvis ikke folketrygdloven', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'arbeidsmiljøloven',
            lovverksversjon: '2005-06-17-62',
            kapittel: '8',
            paragraf: '1',
        }

        expect(getLovdataUrl(hjemmel)).toBeUndefined()
    })

    it('skal returnere undefined hvis ingen kapittel', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'folketrygdloven',
            lovverksversjon: '1997-02-28-19',
            kapittel: '',
            paragraf: '1',
        }

        expect(getLovdataUrl(hjemmel)).toBeUndefined()
    })

    it('skal generere URL med kapittel og paragraf', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'folketrygdloven',
            lovverksversjon: '1997-02-28-19',
            kapittel: '8',
            paragraf: '1',
        }

        expect(getLovdataUrl(hjemmel)).toBe('https://lovdata.no/lov/1997-02-28-19/§8-1')
    })

    it('skal bruke paragraf 1 som fallback når ingen paragraf er spesifisert', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'folketrygdloven',
            lovverksversjon: '1997-02-28-19',
            kapittel: '2',
            paragraf: '',
        }

        expect(getLovdataUrl(hjemmel)).toBe('https://lovdata.no/lov/1997-02-28-19/§2-1')
    })

    it('skal håndtere case-insensitive folketrygdloven', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'FOLKETRYGDLOVEN',
            lovverksversjon: '1997-02-28-19',
            kapittel: '8',
            paragraf: '1',
        }

        expect(getLovdataUrl(hjemmel)).toBe('https://lovdata.no/lov/1997-02-28-19/§8-1')
    })

    it('skal håndtere folketrygdloven med ekstra tekst', () => {
        const hjemmel: Vilkårshjemmel = {
            lovverk: 'folketrygdloven av 1997',
            lovverksversjon: '1997-02-28-19',
            kapittel: '8',
            paragraf: '1',
        }

        expect(getLovdataUrl(hjemmel)).toBe('https://lovdata.no/lov/1997-02-28-19/§8-1')
    })
})
